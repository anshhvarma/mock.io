/** @type { import("drizzle-kit").Config} */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials:{
        url: 'postgresql://mockai_owner:Ng2rTaxU9dzo@ep-super-wave-a52bouse.us-east-2.aws.neon.tech/mockai?sslmode=require',
    }
}