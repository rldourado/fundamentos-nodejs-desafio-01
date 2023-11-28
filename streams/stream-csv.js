import axios from 'axios'
import { parse } from 'csv-parse'
import fs from 'node:fs/promises'

async function readCSV() {

  const records = []
  const parser = parse({
    delimiter: ',',
    from_line: 2
  })

  parser.on('readable', function(){
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  })

  parser.on('error', function(err){
    console.error(err.message);
  })

  parser.on('end', function(err){
    console.log('parse end');
  })

  try {
    const data = await fs.readFile( 'streams/tasks.csv', { encoding: 'utf8' } )
    
    console.log( data.toString() )
    
    parser.write( data )
    parser.end()
  } catch( err ) {
    console.log( err )
  }

  console.log(records)

  for (const record of records) {
    console.log(record)
    axios.post('http://localhost:3333/tasks', {
      "title": record[0],
      "description": record[1]
    })
  }
}
readCSV()
