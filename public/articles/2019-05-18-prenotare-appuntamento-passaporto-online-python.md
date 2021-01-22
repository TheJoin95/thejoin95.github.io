---title: Prenotare appuntamento passaporto online - Italia
description: Verifica la disponibilità per richiedere il passaporto
permalink: prenotare-appuntamento-passaporto-online
icon: document
date: 2019-05-18
category: php
tags: [php]
---

# Agenda per appuntamenti passaporto - Italia

This article is in italian.


Prendere un appuntamento online per fare il passaporto italiano è un'avventura, dal titolo: "Una storia infinita".

## Perché l'appuntamento online?
E' davvero utile. Ti permettere di saltare la fila in caserma/questura perché ti viene assegnato un orario nel quale presentarsi.
E' necessario essere puntuali e far notare a chiunque che si è in possesso dell'appuntamento.

## Come funziona?
Il sito di [riferimento](https://www.passaportonline.poliziadistato.it) mostra, una volta loggati tramite le proprie credenziali, un calendario suddiviso per località (questure e caserme) dove è possibile richiedere il passaporto.

Dal calendario è possibile prenotare un appuntamento per i vari slot disponibili.

Qui arriva il bello.

Gli slot disponibili... sono solo un miraggio.
Non è ben chiaro come funziona l'assegnazione di questi slot, se esiste una procedura di lock o altro.
Quando sono "disponibili" non lo sono per davvero.
Quando non ci sono, invece sono disponibili.
Quando finalmente ne scegli uno, l'interfaccia esplode.

Sono particolari.

## La soluzione (o definita tale)
Creare uno script che controlla la VERA disponibilità degli slot di appuntamento.

Lo script funziona come di seguito:
- Simula l'accesso e la navigazione del portale tramite le proprie credenziali (non verranno mai condivisi con altri)
- Effettuerà il controllo di disponibilità su tutte le località disponibili per la vostra zona
- Recupererà e mostrerà la disponibilità a video ogni volta che verrà eseguito lo script

No, non prenoterà al vostro posto.
Dovrete farlo voi, perché quella è l'unica parte che funziona ed è fondamentale non sbagliare altrimenti è stata solo una perdita di tempo.

La repository del progetto per usarlo e per contribuire:
[Github Repository](https://github.com/TheJoin95/passport-agenda-notification)

Prego.


### Note
Lo script è datato Aprile 2019. Eventuali aggiornamenti grafici o procedurali del portale potrebbero portare a qualche malfunzionamento dello script.
Siete liberi di farmelo notare o di contribuire direttamente su Github, così da correggere e renderlo fruibile di nuovo a tutti.

Grazie