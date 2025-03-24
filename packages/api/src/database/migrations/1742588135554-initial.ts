import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1742588135554 implements MigrationInterface {
    name = 'Initial1742588135554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "theater" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, "totalSeats" integer NOT NULL, "seatLayout" jsonb NOT NULL, CONSTRAINT "PK_c70874202894cfb1575a5b2b743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seats" text NOT NULL, "customerName" character varying NOT NULL, "customerEmail" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "showtimeId" uuid, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "showtime" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "price" numeric(10,2) NOT NULL, "availableSeats" text NOT NULL, "movieId" uuid, "theaterId" uuid, CONSTRAINT "PK_46e9942cf953d98b7dc4392a3e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer NOT NULL, "genre" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "posterUrl" character varying NOT NULL, "rating" character varying NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_46a225e6b858f2b52ed98e3aec3" FOREIGN KEY ("showtimeId") REFERENCES "showtime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "showtime" ADD CONSTRAINT "FK_1af27f8171269552599f8e18ff1" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "showtime" ADD CONSTRAINT "FK_24e5e3a06a5041e9f10c48bc917" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "showtime" DROP CONSTRAINT "FK_24e5e3a06a5041e9f10c48bc917"`);
        await queryRunner.query(`ALTER TABLE "showtime" DROP CONSTRAINT "FK_1af27f8171269552599f8e18ff1"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_46a225e6b858f2b52ed98e3aec3"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "showtime"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "theater"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
