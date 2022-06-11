import { useState, useRef } from "react";
import * as axios from 'axios';
import { useRouter } from "next/router";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


function Product(props) {
  const Router= useRouter();

  const PUBLIC_KEY= "pk_test_51L3VYgKqeiMl7ByHxz6yT5y2hd1T44bZfIScbgz50JkJkbuStKovE8r1aaDnXKThgdjjda0loltrXPQ8tjoE5bIH00894ZjJ2j";
  const stripeTestPromise= loadStripe(PUBLIC_KEY);
    
  
  const [success,setSuccess]= useState(false);

  const [message, setMessage] = useState('');
  const {
    id,
    name,
    size,
    image,
    slug,
    price,
    stock,
    category,
    measurement,
    weight,
  } = props;

  const   CARD_OPTIONS={
    iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
  };

  const handleNewOrder = async (e) => {
    e.preventDefault()
   
    const {error, paymentMethod}= await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    })

    if (!error){
      try{
        const { data } = await axios.default.post('https://se-lecture-8-node-vercel-h814dy0vt-desoukya-gmailcom.vercel.app/api/orders', {
          name,
          price,
        });
        if (data) {
          setSuccess(true)
          setMessage(`Success! Your order number is: ${data.id}`);
        }
      }catch(error){
        setMessage("Error "+ error)
      }
    }
    else {
      setMessage("Error "+ error)
     }
      
  };

  const stripe= useStripe();
  const elements= useElements();

  return (
    <div className="container mx-auto px-6">
      <div className="md:flex md:items-center">
        <div className="w-full h-64 md:w-1/2 lg:h-96 ">
          <img className="h-full w-full rounded-md object-cover max-w-lg mx-auto" src={image} alt="" />
        </div>
        <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2 lg:py-12">
          <h3 className="text-3xl leading-7 mb-2 font-bold uppercase lg:text-5xl">
            {name}
          </h3>
          <span className="text-2xl leading-7 font-bold mt-3">
            ${price}
          </span>
          <br>
          </br>
          <br>
          </br>

          <div>
            <Elements stripe= {stripeTestPromise}>
              {!success ? 
                <form onSubmit={handleNewOrder}>
                  <fieldset className='FormGroup'>
                      <div className='FormRow'>
                          <CardElement options={CARD_OPTIONS}/>
                      </div>
                  </fieldset> 
                  <div className="mt-12 flex flex-row justify-between ">
                        
                      <button
                            className="border p-2 mb-8 border-black shadow-offset-lime w-2/3 font-bold"
                            
                          >
                            Order Product
                      </button>
                  </div>     
                </form>  : 
                <div>
                  <h2>hhh</h2>
                </div> 
              }  
            </Elements>
          </div>
          
          <div>
            <span className="text-red-600 leading-7 font-bold mt-3">
              {message}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-16 md:w-2/3">
        <h3 className="text-gray-600 text-2xl font-medium">Category</h3>
        {category}
      </div>
    </div>
  );
}
//
export default Product;
