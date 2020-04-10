/*
* Desenvolvedor: Silvanei Martins;
* Email: silvaneimartins_rcc@hotmail.com;
* WhatsApp: (69) 9.8405-2620;  
* Desafio conceito NodeJS;
*/
const express = require('express')
const { uuid, isUuid } = require('uuidv4')

const app = express()
app.use(express.json())
const documents = []

function logRequest(request, response, next) {
  const { method, url } = request
  const logLabel = `${method.toUpperCase()} ${url}`

  console.log(logLabel)
  next()

  console.timeEnd(logLabel)
}

function validProjectId(request, response, next) {
  const { id } = request.params
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.'})
  }
  return next()
}

app.use(logRequest)
app.use('/documents/:id', validProjectId)

app.get('/documents', (request, response) => {
  const { title } = request.query
  const results = title
    ? documents.filter(document => document.title.includes(title))
    : documents
  return response.json(results)
})

app.post('/documents', (request, response) => {
  const { title, owner } = request.body
  const document = { id: uuid(), title, owner }
  documents.push(document)
  return response.json(document)
})

app.put('/documents/:id',validProjectId, (request, response) => {
  const { id } = request.params
  const { title, owner } = request.body
  const documentIndex = documents.findIndex(document => document.id === id)
  if (documentIndex < 0) {
    return response.status(400).json({ error: 'Document not found.' })
  }
  const document = {
    id,
    title,
    owner,
  }
  documents[documentIndex] = document
  return response.json(document)
})

app.delete('/documents/:id', validProjectId, (request, response) => {
  const { id } = request.params
  const documentIndex = documents.findIndex(document => document.id === id)
  if (documentIndex < 0) {
    return response.status(400).json({ error: 'Document not found.' })
  }
  documents.slice(documentIndex, 1)
  return response.status(204).send()
})


app.listen(3333, () => {
  console.log('App Gerenciamento de Documentos OnLine...!')
})