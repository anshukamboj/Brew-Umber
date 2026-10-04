import React, { useEffect, useState } from 'react'
import Pic from '../assets/Caffe.png'
import 'remixicon/fonts/remixicon.css'
import { Link, useNavigate } from 'react-router-dom';

const Menu = () => {
    const [coffee, setcoffee] = useState([]);
    const [loading, setLoading] = useState(true);

    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            fetch('https://api.sampleapis.com/coffee/hot').then(res => res.json()),
            fetch('https://api.sampleapis.com/coffee/iced').then(res => res.json())
        ])
            .then(([hotData, icedData]) => {
                const allCoffees = [...hotData, ...icedData];
                const coffeesWithPrices = allCoffees.map(drink => ({
                    ...drink,
                    price: (Math.random() * (350 - 150) + 150).toFixed(0)
                }));

                setcoffee(coffeesWithPrices);
            }).catch(error => console.error("Error fetching coffees:", error))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = (drink) => {
        setCart((prevCart) => {

            const existingItem = prevCart.find(item => item.title === drink.title);
            if (existingItem) {

                return prevCart.map(item =>
                    item.title === drink.title ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [...prevCart, { ...drink, quantity: 1 }];
        });
    };

    const updateQuantity = (title, amount) => {
        setCart((prevCart) => prevCart.map((item) => {
            if (item.title === title) {
                return { ...item, quantity: Math.max(1, item.quantity + amount) };
            }
            return item;
        }));
    };

    const removeFromCart = (title) => {
        setCart((prevCart) => prevCart.filter((item) => item.title !== title));
    };
    const getQty = (title) => {
        const found = cart.find((item) => item.title === title);
        return found ? found.quantity : 0;
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    return (
        <div className="bg-white min-h-screen w-full flex justify-center pt-32 pb-12 relative overflow-hidden">

            <div className="bg-[#2c2d31] w-10/12 text-white rounded-2xl flex flex-col items-start px-12 pt-12 pb-12">
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col w-1/2">
                        <h1 className="text-5xl font-serif font-bold">COFFEE MENU</h1>
                        <h4 className="text-gray-300 mt-4 text-lg">A hot drink made from the roasted beans</h4>
                    </div>

                    <div className="flex justify-end items-center gap-6 w-1/2">

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="transition hover:scale-105"
                        >
                            <i className="ri-shopping-bag-4-line bg-orange-400 rounded-2xl p-3 m-2 text-black font-bold flex items-center gap-2 cursor-pointer">
                                <span>Cart: {totalItems}</span>
                            </i>
                        </button>

                        <Link to="/"> <img className="h-24 w-auto object-contain" src={Pic} alt="logo" /></Link>
                    </div>
                </div>

                <hr className="border-t-2 border-white mt-8 w-full" />
                {loading && (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <div className="w-14 h-14 border-4 border-gray-600 border-t-orange-400 rounded-full animate-spin"></div>
                        <p className="text-gray-300 mt-5 text-lg">Loading menu...</p>
                    </div>
                )}

                <div className="w-full mt-12 grid grid-cols-2 gap-8">
                    {coffee.map((drink, index) => (
                        <div key={`${drink.id}-${index}`} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl">

                            <div className="w-24 h-24 shrink-0">
                                <img
                                    src={drink.image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200"}
                                    alt={drink.title}
                                    className="w-full h-full object-cover rounded-full border-2 border-white"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200"; }}
                                />
                            </div>


                            <div className="flex-1 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold">{drink.title}</h3>
                                        <span className="text-lg font-bold text-orange-400">₹{drink.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {drink.description}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    <button
                                        onClick={() => addToCart(drink)}
                                        className="bg-white text-black font-bold py-1.5 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition-colors text-sm"
                                    >
                                        + Add to Cart
                                    </button>

                                    {getQty(drink.title) > 0 && (
                                        <span className="bg-orange-400 text-black font-bold text-sm px-3 py-1 rounded-full">
                                            +{getQty(drink.title)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {totalItems > 0 && !isCartOpen && (
                <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:bg-orange-600 transition flex items-center gap-3"
                >
                    <i className="ri-shopping-bag-4-line"></i>
                    Order ({totalItems}) · ₹{totalPrice.toFixed(2)}
                </button>
            )}

            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
                    onClick={() => setIsCartOpen(false)}
                >

                    <div
                        className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex justify-between items-center border-b pb-4 mb-4 text-black">
                            <h2 className="text-2xl font-bold font-serif">Your Order</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-500 hover:text-red-500 text-2xl"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>


                        <div className="flex-1 overflow-y-auto text-black">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <i className="ri-shopping-cart-2-line text-6xl mb-4"></i>
                                    <p className="text-lg">Your cart is empty.</p>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="flex-1">
                                            <strong className="text-lg block">{item.title}</strong>
                                            <span className="text-orange-500 font-bold">₹{item.price}</span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                                            <button onClick={() => updateQuantity(item.title, -1)} className="text-xl px-2 hover:text-orange-500">-</button>
                                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.title, 1)} className="text-xl px-2 hover:text-orange-500">+</button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.title)}
                                            className="ml-4 text-red-400 hover:text-red-600 p-2"
                                        >
                                            <i className="ri-delete-bin-line text-xl"></i>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>


                        <div className="border-t pt-4 mt-auto text-black">
                            <div className="flex justify-between text-xl font-bold mb-4">
                                <span>Total:</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                disabled={cart.length === 0}
                                onClick={() => navigate('/checkout', { state: { cart } })}
                                className={`w-full py-4 rounded-xl text-lg font-bold transition ${cart.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                    }`}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

export default Menu;