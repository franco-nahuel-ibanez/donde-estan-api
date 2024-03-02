import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709361638276 implements MigrationInterface {
    name = 'Migration1709361638276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mobile_os_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mobile_version\` (\`id\` int NOT NULL AUTO_INCREMENT, \`version\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`mobile_os_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`mobile_version\` ADD CONSTRAINT \`FK_3c47fb1e9d7d3e83c36db849d28\` FOREIGN KEY (\`mobile_os_id\`) REFERENCES \`mobile_os_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mobile_version\` DROP FOREIGN KEY \`FK_3c47fb1e9d7d3e83c36db849d28\``);
        await queryRunner.query(`DROP TABLE \`mobile_version\``);
        await queryRunner.query(`DROP TABLE \`mobile_os_type\``);
    }

}
