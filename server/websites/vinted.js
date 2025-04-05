import { v5 as uuidv5 } from 'uuid';

const parse = data => {
    try {
      const { items } = data;
  
      return items.map(item => {
        const link = item.url;
        const price = item.total_item_price;
        const { photo } = item;
        const published = photo.high_resolution && photo.high_resolution.timestamp;
  
        return {
          link,
          'price': price.amount,
          title: item.title,
          'published': (new Date(published * 1000)).toUTCString(),
          'uuid': uuidv5(link, uuidv5.URL)
        };
      });
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };
  
  const scrape = async searchText => {
    try {
      const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741630196&search_text=${searchText}&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=`, {
        credentials: 'include',
        method: 'GET',
        mode: 'cors',
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "fr",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
          "sec-ch-ua-arch": "\"x86\"",
          "sec-ch-ua-bitness": "\"64\"",
          "sec-ch-ua-full-version": "\"129.0.6668.59\"",
          "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"129.0.6668.59\", \"Not=A?Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"129.0.6668.59\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": "\"\"",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-ch-ua-platform-version": "\"19.0.0\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "x-anon-id": "98bb9607-00c4-4fc4-a3af-62b0b17ed510",
          "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
          "x-money-object": "true",
          "cookie": "v_udt=eDVpY0R6N2phNGg4SGNJTDNEbXpYYUxlMlBMRS0tWlp1QUoyMEVDNm9MVDN4eC0tYkh6Z3lOWGViZTlsN29pRWhTeC9TZz09; OTAdditionalConsentString=1~; anonymous-locale=fr; OptanonAlertBoxClosed=2025-02-13T14:31:27.378Z; eupubconsent-v2=CQMw49gQMw49gAcABBENBcFgAAAAAAAAAChQAAAAAAFBIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAYAAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AF0AMQAYsAyEBkwDRgGmgNTAa8A2gBtgDbgHHwOdA58B5QD4gH2wP2A_cCB4EEQIMAQbAhWOglAALgAoACoAHAAQAAugBkAGoAPAAiABMACrAFwAXQAxABvAD0AH6AQwBEgCWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBwABYAFAAXABVAC4AGIAN4AegBHADvAIoASkAoIBVwC5gGKANoAdSBTQFNgLFAWiAuABcgDJwGcgNVAeOBC0lAiAAQAAsACgAHAAeABEACYAFUALgAYoBDAESAI4AUYArQBsgDvAH4AVcAxQB1AEOgIvASIAo8BYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbgALgAoACoAHAAQQAyADQAHgARAAmABSACqAGIAP0AhgCJAFGAK0AZQA0QBsgDvgH2AfoBFgCMAFBAKuAXMAvIBigDaAG4AQ6Ai8BIgCdgFDgKbAWKAtgBcAC5AF2gLzAX0Aw0BkgDJ4GWAZcAzmBrAGsgNvAbqA5MB44D2gIQgQtKAIQALgAkAEcAOcAdwBAACRAFiANeAdsA_4CPQEigJiATaApABT4CuwF0ALyAYsAyYBqYDXgHlAPigfsB-4EDAIHgQTAgwBBsCFYAAA.YAAAAAAAAAAA; domain_selected=true; anon_id=5cef6c16-b43a-4e04-b6c9-60e924468c9f; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODYzMzc2LCJzaWQiOiIxMzdiY2RmNS0xNzQzODYzMzc2Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM4NzA1NzYsInB1cnBvc2UiOiJhY2Nlc3MifQ.GbIDDgc8L1cQIwZcd23D88SQ8i6tn-wAlxEbJnuDTSpIfAsvdPB4LVWEsEjMFEUfrT9DjeI_zixlIvm19yyhSX4881RmJ4tYPJ6ZJjibpjLYFjr8vQ4GQJaT3mG-fQTlTZc18YlVxst4_K6G45QQOSt4H7vRQ38Dfz9JXyV0j9dcqkkYVPWC-SFeRD_a6VjWcedunwI0kRwk4I37FMFQPVMNf3Gb-G-pptjMEsQ3d-nHV8Zj2igpAXOj6xUs34qNUJGVE-yinyxDB13GcpRuJKJ-TH98osqszRb5EYhCc36eXQKl1YPpCHVaTQp6JrhXnzN1AW80rcbIGEdgyMuYig; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODYzMzc2LCJzaWQiOiIxMzdiY2RmNS0xNzQzODYzMzc2Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ0NjgxNzYsInB1cnBvc2UiOiJyZWZyZXNoIn0.d_mDTcxTYYcG6wuqq7amNGVq-O_5zxS2qI9FVEtfXyyWE9T24WL2mJxupXD9craamcou0UeQTeXnfe1npxo2Z7C9BQchFUjpCvN7dzNy_5e_kbIlFvc6JFqg9Lf156b5YtnWoWt5K7mZCXG9e14yYyLd2iJMwO0zQKinCneL1YQ-sZWOXXwuhjJfuZmDEZpXr_WO7pTA1fNaM6vEOMxEkfUQHR4kf-dOLw6hQ9HsNyLXRo32cacWl3Ay6UqUUpuogIcMxDXI0YxxifxHdwFu6WejBAKLUDfFzu_WoP0lx7I3JMLibh6X2J0r3oBDlAKvhBRvJWHFioBfjLQtsa-JZQ; v_sid=ca7f747324ebfa5872e38c3169c870e9; datadome=QdY69vrS1tqf98bsXlnQZQPibu80t7mDtGtrOLkoth2Nn5RABp7T5vqXjWTlbfF0yDMry9zTSSOEUNPIn6hRsaSNpMnJ9XIXebRlPsDqM9LZj1o0vpOhhHPuHsuqN9~r; __cf_bm=3XqSaPWmB_DDJzSY8LR6iLJOdarsiBlmyeVW7Q3lSj0-1743863449-1.0.1.1-xvhUQdIEbyzdPyTodBxD8ajdpEwCKoHUXZENCjb6gu23M9eS8EYCq6PuJnQovSnyKrCprlXHnhNuh7nTVjWYncVAxKxkS4vlVX3soQaFVikTIeE16fr9_lcKMIJzcsy4; viewport_size=275; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+16%3A30%3A49+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=5cef6c16-b43a-4e04-b6c9-60e924468c9f&interactionCount=26&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; cf_clearance=ZEgIY59e_pRkm5EN8MkDptssGV11W3iGbwQspk30zKk-1743863450-1.2.1.1-PfSTdXHqMBrWe..qRrIiJdndpUKQjFdhhSGgPnol5SgkHyCz.vODDgBrRoAEFfvAVY8lywDFcZOMGsreos5p1KSCZVsI4uBxV1StFAW7PENIyvBgBuOA3zRrHeUaPq0LCqnvFIsOkJueEL89pqUx2PyzkrEptnOWFf6KqMmM3eVP05WcnpN50QFFf_8ahjH1psq2pqCC50lVrA3IxfzwdaYB6MnMtRaMq_jZdTQ1v3qpW4OiX44ltdX7uGf7Vh3I988J2JEwvAXElde969JPwAfRtHm9JthTMgZJbSAB.IVuyGdTGdvtjkcjMuB3spPXtD.V4GIGIoAOvjPXdK2rwCzd4BGKrEjsIyk6.GjNeew; _vinted_fr_session=aTRXZkdyeVRvWWJWUlNkcHVKUGVhL2xObVJNcjcwS1dldk1PT3pjKy9UaEhnRjg4R0hEZ2tXWjN5eVZrUHZZTnJzWExSUitwTXphdHV2ZVBzMFJHQmRhMTFaeUxna2pEdnJnTk9DTFhkTm01eUF1T3ZKR1JiaW5Nd1RIRUFERHh0STcraG5SVVdwOWp6alAzSytLVG1LMVkzZ20rdS9sUUp4VTZQSHF3Y1BqeFJsS1lUQ0VoWkw3cXg5WVJPY2VJSG9oQ3k5anJxMmZzbTlaakJTR3FVMnBEbkkreDVXWTBLSW1UNGhpZ1hnazU0RXdILzRiRUd1c2tKYWhYYU5pTS0tYnp4MHJYQTAwdE91VW9uZjFmckNIQT09--2683c1733958ddcae203d5da34a28389b92f56c9; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?time=1741633566&search_text=42151&page=1",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        referrer: `https://www.vinted.fr/catalog?search_text=${searchText}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null
      });
  
      if (response.ok) {
        const body = await response.json();
        return parse(body);
      }
  
      console.error('Error fetching data:', response);
      return null;
  
    } catch (e) {
      console.error('Error in scrape function:', e);
      return null;
    }
  };
  
  export { scrape };