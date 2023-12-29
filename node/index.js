import express from 'express'
import mysql from 'mysql2'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.set('views', path.join(__dirname))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const connection = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: 'root1234',
  database: 'nodedb'
})
connection.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL Server!')
})

function listUsers() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

function createUser(name) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET name = ?', name, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

app.get('/', async (_, res) => {
  const users = await listUsers()
  res.render('./page.ejs', { users })
})

app.post('/clubreq', async (req, res) => {
  const nickname = req.body.nickname

  await createUser(nickname)

  const users = await listUsers()
  res.render('./page.ejs', { users })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
