import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      /**
       * If "true", values from the process.env object will be cached in the memory.
       * This improves the overall application performance.
       * See: https://github.com/nodejs/node/issues/3104
       */
      cache: true,
      /**
       * If "true", registers `ConfigModule` as a global module.
       * See: https://docs.nestjs.com/modules#global-modules
       */
      isGlobal: true,
      /**
       * Path to the environment file(s) to be loaded.
       */
      envFilePath: ['.env.local', '.env'],
      /**
       * Array of custom configuration files to be loaded.
       * See: https://docs.nestjs.com/techniques/configuration
       */
      // load: [configuration],
      /**
       * Custom function to validate environment variables. It takes an object containing environment
       * variables as input and outputs validated environment variables.
       * If exception is thrown in the function it would prevent the application from bootstrapping.
       * Also, environment variables can be edited through this function, changes
       * will be reflected in the process.env object.
       */
      // validate?: (config: Record<string, any>) => Record<string, any>,
      /**
       * Environment variables validation schema (Joi).
       */
      // validationSchema?: any,
      /**
       * Schema validation options.
       * See: https://joi.dev/api/?v=17.3.0#anyvalidatevalue-options
       */
      // validationOptions?: Record<string, any>;
    }),
  ],
})
export class ConfigurationModule {}
