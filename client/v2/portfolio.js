// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}" target=_blank">${deal.title}</a>
        <span>${deal.price}</span>
        <button class="save-favorite" data-id="${deal.uuid}">Save as favorite</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);

  // Add event listeners for "Save as favorite" buttons
  document.querySelectorAll('.save-favorite').forEach(button => {
    button.addEventListener('click', (event) => {
      const dealId = event.target.getAttribute('data-id');
      saveAsFavorite(dealId);
    });
  });
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)

  // Add button to show favorite deals
  const favoriteButton = document.createElement('button');
  favoriteButton.innerText = 'Show favorite deals';
  favoriteButton.addEventListener('click', () => {
    const favoriteDeals = getFavoriteDeals();
    const filteredDeals = deals.filter(deal => favoriteDeals.includes(deal.uuid));
    renderDeals(filteredDeals);
  });
  sectionDeals.appendChild(favoriteButton);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Select the page to display
 */
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();
  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/**
 * Filter deals by best discount
 */
const filterBestDiscount = deals => {
  return deals.filter(deal => deal.discount > 50);
};

/**
 * Filter deals by most commented
 */
const filterMostCommented = deals => {
  return deals.filter(deal => deal.comments > 15);
};

/**
 * Filter deals by hot deals
 */
const filterHotDeals = deals => {
  return deals.filter(deal => deal.temperature > 100);
};

// Add event listeners for filter buttons
document.querySelector('#filter-best-discount').addEventListener('click', () => {
  const filteredDeals = filterBestDiscount(currentDeals);
  render(filteredDeals, currentPagination);
});

document.querySelector('#filter-most-commented').addEventListener('click', () => {
  const filteredDeals = filterMostCommented(currentDeals);
  render(filteredDeals, currentPagination);
});

document.querySelector('#filter-hot-deals').addEventListener('click', () => {
  const filteredDeals = filterHotDeals(currentDeals);
  render(filteredDeals, currentPagination);
});


/**
 * Sort deals by price
 * @param {Array} deals - list of deals
 * @param {String} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} sorted deals
 */
const sortByPrice = (deals, order) => {
  return deals.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
};

/**
 * Sort deals by date
 * @param {Array} deals - list of deals
 * @param {String} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} sorted deals
 */
const sortByDate = (deals, order) => {
  return deals.sort((a, b) => order === 'asc' ? new Date(a.published) - new Date(b.published) : new Date(b.published) - new Date(a.published));
};

/**
 * Fetch Vinted sales for a given lego set id
 * @param {String} id - lego set id
 * @returns {Array} list of sales
 */
const fetchVintedSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Add event listeners for sort options
document.querySelector('#sort-select').addEventListener('change', (event) => {
  let sortedDeals;
  switch (event.target.value) {
    case 'price-asc':
      sortedDeals = sortByPrice(currentDeals, 'asc');
      break;
    case 'price-desc':
      sortedDeals = sortByPrice(currentDeals, 'desc');
      break;
    case 'date-asc':
      sortedDeals = sortByDate(currentDeals, 'asc');
      break;
    case 'date-desc':
      sortedDeals = sortByDate(currentDeals, 'desc');
      break;
    default:
      sortedDeals = currentDeals;
  }
  render(sortedDeals, currentPagination);
});

// Add event listener for lego set id selection
document.querySelector('#lego-set-id-select').addEventListener('change', async (event) => {
  const sales = await fetchVintedSales(event.target.value);
  renderSales(sales);
});

/**
 * Render list of sales
 * @param {Array} sales - list of sales
 */
const renderSales = (sales) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = sales
    .map(sale => {
      return `
      <div class="sale" id=${sale.uuid}>
        <span>${sale.id}</span>
        <a href="${sale.link}">${sale.title}</a>
        <span>${sale.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Sales</h2>';
  sectionDeals.appendChild(fragment);
};


/**
 * Calculate specific indicators for a given set of sales
 * @param {Array} sales - list of sales
 * @returns {Object} indicators
 */
const calculateIndicators = (sales) => {
  const prices = sales.map(sale => parseFloat(sale.price));
  const totalDeals = sales.length;
  const averagePrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const sortedPrices = prices.sort((a, b) => a - b);
  const p5Price = sortedPrices[Math.floor(prices.length * 0.05)];
  const p25Price = sortedPrices[Math.floor(prices.length * 0.25)];
  const p50Price = sortedPrices[Math.floor(prices.length * 0.50)];
  const lifetimeValue = (new Date() - new Date(sales[0].published)) / (1000 * 60 * 60 * 24); // in days

  return {
    totalDeals,
    averagePrice,
    p5Price,
    p25Price,
    p50Price,
    lifetimeValue
  };
};

// Add event listener for lego set id selection
document.querySelector('#lego-set-id-select').addEventListener('change', (event) => {
  const selectedSetId = event.target.value;
  const filteredDeals = currentDeals.filter(deal => deal.id === selectedSetId);
  renderDeals(filteredDeals);
  const indicators = calculateIndicators(filteredDeals);
  renderSalesIndicators(indicators);
});

/**
 * Render specific indicators
 * @param {Object} indicators - calculated indicators
 */
const renderSalesIndicators = (indicators) => {
  document.querySelector('#nbDeals').innerText = indicators.totalDeals;
  document.querySelector('#average-price').innerText = indicators.averagePrice.toFixed(2);
  document.querySelector('#p5-price').innerText = indicators.p5Price.toFixed(2);
  document.querySelector('#p25-price').innerText = indicators.p25Price.toFixed(2);
  document.querySelector('#p50-price').innerText = indicators.p50Price.toFixed(2);
  document.querySelector('#lifetime-value').innerText = indicators.lifetimeValue.toFixed(2);
};

/**
 * Save a deal as favorite
 * @param {String} dealId - ID of the deal to save as favorite
 */
const saveAsFavorite = (dealId) => {
  const favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];
  if (!favoriteDeals.includes(dealId)) {
    favoriteDeals.push(dealId);
    localStorage.setItem('favoriteDeals', JSON.stringify(favoriteDeals));
    alert('Deal saved as favorite!');
  } else {
    alert('Deal is already in favorites!');
  }
};

/**
 * Get favorite deals from localStorage
 * @returns {Array} list of favorite deal IDs
 */
const getFavoriteDeals = () => {
  return JSON.parse(localStorage.getItem('favoriteDeals')) || [];
};