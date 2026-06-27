import dotenv from "dotenv";
import connection from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import referenceTable from "../utils/referenceTable.js";
dotenv.config();
const PORT = process.env.PORT;

export async function getUrl(req, res) {
  const shortUrl = `http://localhost:${PORT}/shortify/${req.params.hashId}`;

  connection.query(
    "SELECT * FROM Container WHERE shortUrl = ?",
    [shortUrl],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      const origUrl = rows[0].longUrl;

      return res.status(200).json({
        success: true,
        origUrl,
      });
    }
  );
}

export async function postUrl(req, res) {
  const ogUrl = req.body.url;

  connection.query(
    `SELECT * FROM Container WHERE longUrl=?`,
    [ogUrl],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (rows.length > 0) {
        return res.status(200).json({
          message: "URL already shortified!",
          shortUrl: rows[0].shortUrl,
          longUrl: ogUrl,
        });
      }

      const uuid = uuidv4();
      var numericID = 1;
      for (let i = 0; i < uuid.length; i++) {
        let ch = uuid[i];
        let val = ch.charCodeAt(0);
        if (val >= 48 && val <= 57) {
          numericID += val - 48;
        } else if (val >= 65 && val <= 90) {
          numericID += val - 65 + 11;
        } else if (val >= 97 && val <= 122) {
          numericID += val - 97 + 73;
        }
      }
      const salt = Math.ceil(Math.random() * 100) * 23 * 7;
      numericID = numericID * salt;

      // Step - 2: Base 62 conversion
      var genHashVal = "";
      let dummyId = numericID;

      while (dummyId > 0) {
        const rem = dummyId % 62;
        genHashVal += referenceTable[rem];
        dummyId = Math.floor(dummyId / 62);
      }
      const hashValue = genHashVal;

      // Step-3: Generate your own short url from this hashed value
      const shortUrl = `http://localhost:${PORT}/shortify/${hashValue}`;

      // Step-4: Save this shortUrl with the ogUrl in the db
      connection.query(
        "INSERT INTO Container (longUrl, shortUrl) VALUES (?)",
        [[ogUrl, shortUrl]],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to save URL" });
          }

          return res.status(200).json({
            message: "Inserted the new URL",
            shortUrl: shortUrl,
            longUrl: ogUrl,
          });
        }
      );
    }
  );
}
