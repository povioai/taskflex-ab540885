import { cosmiconfigSync } from 'cosmiconfig';

/**
 * Load the raw config from ./config/${STAGE}.api.yaml
 * do not use directly, use loadConfig with a typed config instead
 */
export function readConfig(options: { moduleName: string; directory: string }): Record<string, any> {
  const { search } = cosmiconfigSync(options.moduleName, {
    searchPlaces: ['.json', '.yaml', '.yml', '.js', '.ts', '.cjs'].map((ext) => `${options.moduleName}${ext}`),
    // stopDir: options.directory, // only search one folder
  });
  const result = search(options.directory);

  if (!result || !result.filepath) {
    throw new Error(`No config or fallback found: ${options.directory}${options.moduleName}.yml`);
  }

  if (result.isEmpty) {
    throw new Error(`Empty config found: ${result.filepath}`);
  }

  return result?.config;
}
