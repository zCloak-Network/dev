// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import glob from 'glob';
import { ImportedPackageType, parse as parseTs } from 'parse-imports-ts';
import path, { join } from 'path';
import throatFactory from 'throat';

import { error } from './feedback';
import { readFileAsync } from './fs';
import { readPackageJson } from './package-json';

const MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED = 50;
const throat = throatFactory(MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED);

const ignoredDependencies = [
  // node
  'crypto',
  'fs',
  'path',
  'process',
  'readline',
  'util',
  // other
  '@jest/globals',
  'react',
  'react-native'
];

enum PackageType {
  NormalImport,
  DevImport
}

enum FileType {
  Source,
  Test
}

interface FileDetails {
  file: string;
  type: FileType;
}

function convertType(packageType: ImportedPackageType, fileType: FileType): PackageType {
  switch (fileType) {
    case FileType.Test:
      return PackageType.DevImport;

    default:
      switch (packageType) {
        case ImportedPackageType.NormalImport:
          return PackageType.NormalImport;
        case ImportedPackageType.TypeImport:
          return PackageType.DevImport;
        default:
          throw new Error(`Type ${packageType} not supported`);
      }
  }
}

interface ImportDetails {
  name: string;
  files: string[];
  type: PackageType;
}

async function parseFileTs(file: FileDetails): Promise<ImportDetails[]> {
  const code = await readFileAsync(file.file);
  const result = parseTs(code, file.file);

  return result.map(({ name, type }) => ({
    files: [file.file],
    name,
    type: convertType(type, file.type)
  }));
}

async function parseFile(file: FileDetails): Promise<ImportDetails[]> {
  try {
    return parseFileTs(file);
  } catch (e) {
    error(`Could not parse "${file}"`);
    error(e);

    return [];
  }
}

const getFileList = (sourceFiles: string[], testFiles: string[]): FileDetails[] =>
  sourceFiles.map((file): FileDetails => {
    const type = testFiles.includes(file) ? FileType.Test : FileType.Source;

    return { file, type };
  });

async function getImportsForFiles(files: FileDetails[]): Promise<ImportDetails[]> {
  const imports = await Promise.all(
    files.map((f: FileDetails): Promise<ImportDetails[]> => throat(() => parseFile(f)))
  );

  return imports.reduce((acc: ImportDetails[], list: ImportDetails[]): ImportDetails[] => {
    list?.forEach((item) => {
      const newImport = acc.find((existing) => existing.name === item.name);

      if (newImport) {
        newImport.files = [...new Set([...newImport.files, ...item.files])];
        newImport.type =
          newImport.type === PackageType.NormalImport ? PackageType.NormalImport : item.type;
      } else {
        acc.push({ ...item, files: [...item.files] });
      }
    });

    return acc;
  }, [] as ImportDetails[]);
}

const getFiles = () => (pattern: string) =>
  new Promise<string[]>((resolve, reject) => {
    const forFiles = (err: Error | null, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map((f) => join('src', f)));
      }
    };

    glob(pattern, { cwd: 'src' }, forFiles);
  });

function getSourceFiles(): Promise<string[]> {
  const pattern = '**/*.{ts,tsx,js,jsx,mjs,mts,cts}';

  return getFiles()(pattern);
}

async function getTestFiles(): Promise<string[]> {
  const lists: string[][] = await Promise.all(
    ['**/__tests__/**/*.?(m)[jt]s?(x)', '**/?(*.)+(spec|test).?(m)[jt]s?(x)'].map((pattern) =>
      getFiles()(pattern)
    )
  );
  let result: string[] = [];

  for (let i = 0; i < lists.length; i += 1) {
    result = [...new Set([...result, ...lists[i]])];
  }

  return result;
}

interface Errors {
  errors: string[];
}

function getReferences(config: string): [string[], boolean] {
  const configPath = path.join(process.cwd(), config);

  if (fs.existsSync(configPath)) {
    try {
      return [
        JSON.parse(fs.readFileSync(configPath, 'utf-8')).references.map(
          ({ path }: { path: string }) =>
            path.replace('../', '').replace('/tsconfig.build.json', '')
        ),
        true
      ];
    } catch (error) {
      console.error(`Unable to parse ${configPath}`);

      throw error;
    }
  }

  return [[], false];
}

function getErrors(
  base: string,
  locals: [string, string][],
  packageJson: any,
  imports: ImportDetails[]
): Errors {
  const result: Errors = { errors: [] };

  // Report any package used in the src folder that are not specified in the dependencies or peerDependencies.
  imports.forEach((i) => {
    if (i.type === PackageType.NormalImport) {
      if (packageJson.dependencies.includes(i.name)) {
        return;
      }

      if (packageJson.peerDependencies.includes(i.name)) {
        return;
      }

      if (ignoredDependencies.includes(i.name)) {
        return;
      }

      if (i.files.length > 0) {
        result.errors.push(
          `The package "${i.name}" is used in the files ${i.files
            .map((file) => `"${base}/${file}"`)
            .join(',')}. but it is missing from the dependencies in package.json.`
        );
      }
    }

    // Report any type package used in the src folder that are not specified in the devDependencies.
    if (i.type === PackageType.DevImport) {
      if (packageJson.devDependencies.includes(i.name)) {
        return;
      }

      if (packageJson.dependencies.includes(i.name)) {
        return;
      }

      if (ignoredDependencies.includes(i.name)) {
        return;
      }

      if (i.files.length > 0) {
        result.errors.push(
          `Types from the package "${i.name}" are used in the files: ${i.files
            .map((file) => `"${base}/${file}"`)
            .join(',')}. But it is missing from the devDependencies in package.json.`
        );
      }
    }
  });

  imports.forEach((i) => {
    // Report local package in tsconfig.build.json
    if (i.type === PackageType.NormalImport) {
      const local = locals.find(([, name]) => name === i.name);

      if (local) {
        const [references] = getReferences('tsconfig.build.json');

        const ref = local[0];

        if (references.includes(ref)) {
          return;
        }
      } else {
        return;
      }

      if (i.files.length > 0) {
        result.errors.push(
          `The package "${i.name}" is used in the files ${i.files
            .map((file) => `"${base}/${file}"`)
            .join(',')}. but it is missing from the referrences in "${base}/tsconfig.build.json".`
        );
      }
    }
  });

  // Report any package specified in the dependencies that are not used in the src folder.
  const usedImports = imports.map((i) => i.name);

  packageJson.dependencies.forEach((d: any) => {
    if (ignoredDependencies.includes(d)) {
      return;
    }

    if (usedImports.includes(d)) {
      return;
    }

    result.errors.push(
      `The package "${d}" is in the \`dependencies\` of package.json, but it is not used in the source folder. Remove it or move it to the \`devDependencies\`.`
    );
  });

  return result;
}

export async function lintDependencies(base: string, locals: [string, string][]): Promise<Errors> {
  const pkgJsonPromise = readPackageJson();
  const [sourceFiles, testFiles] = await Promise.all([getSourceFiles(), getTestFiles()]);
  const files = getFileList(sourceFiles, testFiles);
  const imports = await getImportsForFiles(files);
  const packageJson = await pkgJsonPromise;

  return getErrors(base, locals, packageJson, imports);
}
