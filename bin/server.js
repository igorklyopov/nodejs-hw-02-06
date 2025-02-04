const app = require('../app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running. Use our API on port: ${PORT}.\nDatabase connection successful.`
      );
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
