import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {imageUrl, title, brand, price, rating} = item
  return (
    <li className="similar-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similiar-product-image"
      />
      <p className="SP-title">{title}</p>
      <p className="SP-brand">by {brand}</p>
      <div className="SP-priceAndRating-Container">
        <p className="SP-price">Rs {price}/-</p>
        <div className="SP-rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
