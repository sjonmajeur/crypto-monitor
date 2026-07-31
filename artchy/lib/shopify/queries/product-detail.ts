import { PRODUCT_CARD_FRAGMENT } from "./products";

export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      productType
      tags
      descriptionHtml
      vendor
      seo {
        title
        description
      }
      options {
        name
        optionValues {
          name
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 12) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const GET_RELATED_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_CARD_FRAGMENT}
  query GetRelatedProducts($query: String, $first: Int!) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;
