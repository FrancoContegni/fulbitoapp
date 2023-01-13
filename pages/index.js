import { Inter } from '@next/font/google';
import Head from 'next/head'
import styles from '../styles/Home.module.css';
import conectarDB from '../lib/dbConnect';
import england from '../models/england';
import React from 'react';
import Image from 'next/image';


export default function Home({englands}) {
  console.log(englands)
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
        englands.map(({_id, team, logo, name}) => (
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
    const res = await england.find({})

    const englands = res.map(doc => {
      const england = doc.toObject()
      england._id = `${england._id}`
      return england
    })

    //console.log(res)
    return {props: {englands}}
  } catch (error){
  console.log(error)
  }
}
