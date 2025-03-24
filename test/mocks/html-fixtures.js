/**
 * Mock HTML fixtures for testing
 */
export const htmlFixtures = {
  solotodo: {
    homepage: `
      <div class="MuiCardContent-root css-1njhssi">
        <div></div><div></div><div></div><div></div>
        <div>$299.990</div>
      </div>
    `,
    product: `
      <div class="MuiStack-root css-j7qwjs">
        <div></div>
        <div>$499.990</div>
      </div>
    `
  },
  amazon: {
    product: `
      <div class="a-price">
        <span class="a-price-symbol">$</span>
        <span class="a-price-whole">29</span>
        <span class="a-price-fraction">99</span>
      </div>
    `,
    searchResult: `
      <div class="a-price">
        <span class="a-price-symbol">$</span>
        <span class="a-price-whole">19</span>
        <span class="a-price-fraction">99</span>
      </div>
    `
  }
};