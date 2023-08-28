import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

class ProductItemDetails extends Component {
  state = {
    selectedProduct: {},
    isLoading: '',
    isSuccess: false,
    quantity: 1,
  }

  componentDidMount() {
    this.getDetailsOfSelectedProduct()
  }

  getDetailsOfSelectedProduct = async () => {
    this.setState({isLoading: true})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(response)
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products.map(item => ({
          availability: item.availability,
          brand: item.brand,
          description: item.description,
          id: item.id,
          imageUrl: item.image_url,
          price: item.price,
          rating: item.rating,
          style: item.style,
          title: item.title,
          totalReviews: item.total_reviews,
        })),
        title: data.title,
        totalReviews: data.total_reviews,
      }

      console.log(formattedData)

      this.setState({
        selectedProduct: formattedData,
        isSuccess: true,
        isLoading: false,
      })
    } else {
      this.setState({isSuccess: false, isLoading: false})
    }
  }

  increaseQuantity = () => {
    this.setState(preState => ({quantity: preState.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(preState => ({quantity: preState.quantity - 1}))
    }
  }

  renderSelectedProductView = () => {
    const {selectedProduct, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = selectedProduct
    return (
      <div className="selected-product-view-container">
        <img src={imageUrl} alt="product" className="selected-product-image" />
        <div className="selected-product-view-content-container">
          <h1 className="selected-product-title">{title}</h1>
          <p className="selected-price">Rs {price}/-</p>
          <div className="ratingAndReview-container">
            <div className="selected-rating-container">
              <p>{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p className="review-item">{totalReviews} Reviews</p>
          </div>
          <p className="selected-description-element">{description}</p>
          <p className="selected-availability">
            Available: <p className="span-ele">{availability}</p>
          </p>
          <p className="selected-availability">
            Brand: <p className="span-ele">{brand}</p>
          </p>
          <hr className="hr-line" />
          <div className="quantity-container">
            <button
              type="button"
              data-testid="minus"
              className="plus-minus-btn"
              onClick={this.decreaseQuantity}
            >
              <BsDashSquare className="icon-element" />
            </button>
            <p>{quantity}</p>
            <button
              type="button"
              data-testid="plus"
              className="plus-minus-btn"
              onClick={this.increaseQuantity}
            >
              <BsPlusSquare className="icon-element" />
            </button>
          </div>
          <button className="add-cart-btn" type="button">
            Add To Cart
          </button>
        </div>
      </div>
    )
  }

  renderSimilarListItem = () => {
    const {selectedProduct} = this.state
    const {similarProducts} = selectedProduct
    console.log(similarProducts)
    if (similarProducts === undefined) {
      return null
    }
    return (
      <ul className="similar-product-list-container">
        {similarProducts.map(item => (
          <SimilarProductItem item={item} key={item.id} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  continueAfterErrorBtnTriggered = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-title">Product Not Found</h1>
      <button
        className="failure-button"
        type="button"
        onClick={this.continueAfterErrorBtnTriggered}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderResultView = () => {
    const {isSuccess} = this.state

    if (isSuccess === true) {
      return this.renderSelectedProductView()
    }
    return this.renderFailureView()
  }

  render() {
    const {isLoading, isSuccess} = this.state
    console.log('console:', isSuccess)
    return (
      <>
        <Header />
        <div className="selected-product-container">
          {isLoading ? this.renderLoaderView() : this.renderResultView()}
          {isSuccess && <h1 className="similar-title">Similar Products</h1>}
          {isSuccess && this.renderSimilarListItem()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
