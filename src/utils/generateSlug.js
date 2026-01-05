import slugify from "slugify";
import pool from "../config/database.js";


export default async function generateUniqueSlug(name) {
    const baseSlug = slugify(name, { lower: true, strict: true, replacement: "-" });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const { rows } = await pool.query("SELECT COUNT(*) FROM products WHERE slug = $1", [slug]);
        const count = parseInt(rows[0].count);

        if (count === 0) {
            break;
        }

        slug = `${baseSlug}-${counter}`
        counter++;
    }

    return slug;
}