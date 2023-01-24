"use client"

import Head from 'next/head'
import conectarDB from '../lib/dbConnect';
import team from '../models/team'
import React from 'react';


export default function Home({teams}) {
  
  return (
    <div>
      <Head>
        <title>Futbolito</title>
    <main>
      <h1>Equipos Liga Inglaterra</h1>
      <p>Acá se pintan 2 documentos obtenidos desde mongodb Atlas. Son del mismo equipo porque hice dos llamadas al mismo equipo, y en lugar de actualizarse los datos, se hizo dos veces. (cuestión de tiempo conoces como se resuelve)</p>
      <p>Una gran ventaja que tenemos es que los datos de mongodb Atlas se pueden manipular</p>
      <h3>Ahora podés machacar el F5 tranquilamente chacal</h3>
      {
        teams.map(({_id, team, logo, name}) => (
          <div key={_id}>
            <img src={logo}></img>
          <h5>{name}</h5>
          </div>
        ))
      }
    </main>
      </Head>
    </div>
  )
}



export async function getServerSideProps(){
  try{
    await conectarDB()
    const res = await team.find({})

    const teams = res.map(doc => {
      const team = doc.toObject()
      team._id = `${team._id}`
      return team
    })
    console.log(res)
    return {props: {teams}}
  } catch (error){
  console.log(error)
  }

  console.log(process.env.ENV_LOCAL_VARIABLE_URI_MONGO);
}


