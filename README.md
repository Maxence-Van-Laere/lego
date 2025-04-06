# 🧱 Lego

> First bricks for profitability

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [📱 Context](#-context)
- [🤔 The bullet-list Problems](#-the-bullet-list-problems)
- [🎯 Objective](#-objective)
- [🛣 How to solve it?](#%F0%9F%9B%A3-how-to-solve-it)
- [👩🏽‍💻 Step by step with Workshops](#%E2%80%8D-step-by-step-with-workshops)
- [📝 Licence](#-licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 📱 Context

LEGO investments is a good source of profit. 

## 🤔 The bullet-list Problems

Collecting profit on your LEGO investments isn’t as easy as it sounds.

* How to identify profitable lego sets?
* How to buy lego sets under the retail price to maximise the profit?
* How to sell profitable lego sets above the retail price?

## 🎯 Objective

**Build an end-to-end web application to determine if a lego set deal is really a good deal.**

## 🛣 How to solve it?

1. 🧱 **Manipulate deals and sold items**: How to [manipulate](https://github.com/92bondstreet/inception/blob/master/themes/1.md#about-javascript) the products in the [browser](https://github.com/92bondstreet/inception/blob/master/themes/1.md#about-htmlcss)
2. 🧹 **Scrape deals and sales**: How to [fetch](https://github.com/92bondstreet/inception/blob/master/themes/2.md#about-nodejs) Products from different website sources
3. 📱 **Render deals and sales in the browser**: How to [interact](https://github.com/92bondstreet/inception/blob/master/themes/3.md#about-prototyping) with the Products in the browser
4. 💽 **Save deals and sales in database**: How to avoid to scrape again and again the same data
5. ⤵️ **Request deals and sales with an api**: How to [give access](https://github.com/92bondstreet/inception/blob/master/themes/2.md#about-restful-api) to your data
6. 🐛 **Test your code**: How to [ensure quality](https://github.com/92bondstreet/inception/blob/master/themes/2.md#about-readme-driven-comment-driven-and-test-driven-development) and confidence
7. 🚀 **Deploy in production**: How to [give access](https://github.com/92bondstreet/inception/blob/master/themes/2.md#about-serverless) to anyone
8. 🎨 **Make a frictionless experience**: How to easily identify profitable deals in [very flew clicks](https://github.com/92bondstreet/inception/blob/master/themes/3.md#about-ux-best-practices)
9. ...

## 👩🏽‍💻 Step by step with Workshops

With [inception](https://github.com/92bondstreet/inception?tab=readme-ov-file#%EF%B8%8F-the-3-themes) themes, we'll follow next workshops to solve our problem:

| Step | Workshops | Planned Date
| --- | --- | ---
| 1 | [Manipulate data with JavaScript in the browser](./workshops/1-manipulate-javascript.md) | Jan 2025
| 2 | [Interact data with JavaScript, HTML and CSS in the browser again](./workshops/2-interact-js-css.md) | Jan 2025
| 3 | [Be an advocate for your design](./workshops/3-advocate-your-design.md) | Jan 2025
| 4 | [Scrape data with Node.js](./workshops/4-scrape-node.md) | Feb 2025
| 5 | [Save data in a Database with MongoDB](./workshops/5-store-mongodb.md) | Mar 2024
| 6 | [Build an api with Express to request data](./workshops/6-api-express.md) | Mar 2025
| 7 | [Deploy in production with Vercel](./workshops/7-deploy.md) | Mar 2025
| n | Design an effective experience | Mar 2025

## 🐞 Problèmes rencontrés

### Erreur CORS dans la console

Lors de l'exécution de l'application, une erreur liée à la politique CORS (Cross-Origin Resource Sharing) a été rencontrée, que ça soit lors de l'execution local ou en production. Voici le message d'erreur affiché dans la console :

```
Access to fetch at 'https://api-webdesign-mvl.vercel.app/deals' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

![Erreur CORS](./images/cors-error.png)

Cela signifie que le serveur API n'autorise pas les requêtes provenant de l'origine `http://localhost:3000`.

### Vérification du bon fonctionnement de l'API

Malgré l'erreur CORS, une vérification directe de l'API montre qu'elle fonctionne correctement. Par exemple, une requête GET sur l'endpoint `https://api-webdesign-mvl.vercel.app/deals` retourne la réponse suivante :

```json
{
  "ack": true
}
```

![Réponse API](./images/api-response.png)

## 📝 Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
