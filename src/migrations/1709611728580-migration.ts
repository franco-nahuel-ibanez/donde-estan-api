import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709611728580 implements MigrationInterface {
    name = 'Migration1709611728580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reporting_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(150) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`person_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(150) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reported_person\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`last_name\` varchar(150) NOT NULL, \`image\` varchar(250) NOT NULL, \`date_of_disappearance\` varchar(150) NOT NULL, \`country\` varchar(150) NOT NULL, \`province\` varchar(150) NOT NULL, \`locality\` varchar(150) NOT NULL, \`description\` longtext NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`reported_by_id\` int NULL, \`status_id\` int NULL, \`person_status_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_enable_code\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`account_enable_date\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`reset_password_code\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`terms_and_conditions\` varchar(150) NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`reported_person\` ADD CONSTRAINT \`FK_5654f701da554a9abe522400329\` FOREIGN KEY (\`reported_by_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reported_person\` ADD CONSTRAINT \`FK_ac609fff6080881185b395e623b\` FOREIGN KEY (\`status_id\`) REFERENCES \`reporting_status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reported_person\` ADD CONSTRAINT \`FK_eec6a02148112bf37bca5fe23ed\` FOREIGN KEY (\`person_status_id\`) REFERENCES \`person_status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reported_person\` DROP FOREIGN KEY \`FK_eec6a02148112bf37bca5fe23ed\``);
        await queryRunner.query(`ALTER TABLE \`reported_person\` DROP FOREIGN KEY \`FK_ac609fff6080881185b395e623b\``);
        await queryRunner.query(`ALTER TABLE \`reported_person\` DROP FOREIGN KEY \`FK_5654f701da554a9abe522400329\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`terms_and_conditions\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`reset_password_code\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_enable_date\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`account_enable_code\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`token\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`user_status\``);
        await queryRunner.query(`DROP TABLE \`reported_person\``);
        await queryRunner.query(`DROP TABLE \`person_status\``);
        await queryRunner.query(`DROP TABLE \`reporting_status\``);
    }

}
