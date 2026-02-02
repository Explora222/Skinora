
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { ProductFilters } from './components/ProductFilters';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastContainer, useToast } from './hooks/useToast';
import { Product, View, CartItem } from './types';
import { storeService } from './services/storeService';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useMouseParticles } from './hooks/useMouseParticles';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(storeService.getCart());
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartBounce, setCartBounce] = useState(false);
  const { toasts, showToast } = useToast();
  
  const particleCanvas = useMouseParticles();
  useScrollReveal();

  useEffect(() => {
    const handleProductNav = (e: any) => {
      navigateToProduct(e.detail);
    };
    window.addEventListener('NAVIGATE_TO_PRODUCT', handleProductNav);
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      window.removeEventListener('NAVIGATE_TO_PRODUCT', handleProductNav);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const products = useMemo(() => storeService.getProducts(), []);
  const featuredProducts = useMemo(() => products.filter(p => p.featured), [products]);

  const handleAddToCart = (e: React.MouseEvent | null, product: Product) => {
    if (e) e.stopPropagation();
    const updated = storeService.addToCart(product);
    setCart([...updated]);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
    showToast(`${product.name} added to bag`, 'success');
  };

  const handleRemoveFromCart = (id: string) => {
    const removed = storeService.getCart().find(item => item.id === id);
    const updated = storeService.removeFromCart(id);
    setCart([...updated]);
    if (removed) {
      showToast(`${removed.name} removed from bag`, 'info');
    }
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const updated = storeService.updateQuantity(id, delta);
    setCart([...updated]);
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setView('PRODUCT_DETAIL');
  };

  const selectedProduct = useMemo(() => 
    selectedProductId ? storeService.getProductById(selectedProductId) : null
  , [selectedProductId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-cream flex flex-col items-center justify-center z-[100]">
        <h1 className="text-4xl font-serif tracking-[0.5em] animate-pulse uppercase mb-4">Skinora</h1>
        <div className="w-12 h-[1px] bg-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream relative">
      <canvas ref={particleCanvas} className="fixed inset-0 pointer-events-none z-10" />
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        cartBounce={cartBounce}
      />

      <main className="flex-grow pt-24 overflow-hidden relative z-5">
        {currentView === 'HOME' && (
          <>
            <section className="relative h-screen -mt-24 overflow-hidden flex items-center justify-center px-6">
              <div className="absolute inset-0">
                <img 
                  src="/assets/skin.avif" 
                  alt="Radiant Skin"
                  className="w-full h-full object-cover animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-black/25"></div>
              </div>
              <div className="relative text-center text-white space-y-6 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-serif tracking-[0.2em] leading-tight animate-fade-in-up luxury-text-reveal uppercase">
                  Skin Deep <br /> 
                  <span className="italic text-brand-gold normal-case tracking-normal text-2xl md:text-4xl">Transformation</span>
                </h2>
                <div className="flex justify-center pt-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <button 
                    onClick={() => setView('SHOP')}
                    className="border border-white/40 px-10 py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-brand-dark transition-all duration-500 font-sans"
                  >
                    Discover Collection
                  </button>
                </div>
              </div>
            </section>

            <section className="py-32 max-w-7xl mx-auto px-6">
              <div className="reveal-hidden flex flex-col md:flex-row justify-between items-end mb-20 space-y-6 md:space-y-0">
                <div className="space-y-4">
                  <p className="uppercase tracking-[0.3em] text-[10px] text-brand-gold font-bold">The Gold Standard</p>
                  <h2 className="text-4xl md:text-6xl font-serif">Curated Selection</h2>
                </div>
                <button 
                  onClick={() => setView('SHOP')}
                  className="text-xs uppercase tracking-widest border-b border-brand-dark pb-1 font-bold hover:text-brand-gold hover:border-brand-gold transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                {featuredProducts.map((product, idx) => (
                  <div key={product.id} className={`reveal-hidden stagger-${(idx % 3) + 1}`}>
                    <ProductCard 
                      product={product} 
                      onClick={navigateToProduct}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>

            <FeaturesShowcase />

            <Testimonials onReady={() => {}} />
            <Newsletter onSubscribe={(email) => showToast(`Welcome! Check your email for your 15% discount code.`, 'success')} />
          </>
        )}

        {currentView === 'SHOP' && (
          <section className="py-20 max-w-7xl mx-auto px-6 min-h-[70vh]">
            <div className="reveal-hidden text-center mb-24 space-y-6">
              <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-widest">The Collection</h1>
              <p className="text-brand-muted tracking-widest text-xs uppercase font-sans">Essential care for every skin type</p>
            </div>
            
            <ProductFilters 
              products={products}
              onFilter={setFilteredProducts}
            />

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-y-20">
                {filteredProducts.map((product, idx) => (
                  <div key={product.id} className={`reveal-hidden stagger-${(idx % 3) + 1}`}>
                    <ProductCard 
                      product={product} 
                      onClick={navigateToProduct}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-brand-muted text-lg mb-6">No products found matching your filters.</p>
                <button
                  onClick={() => setView('SHOP')}
                  className="bg-brand-dark text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        )}

        {currentView === 'PRODUCT_DETAIL' && selectedProduct && (
          <section className="py-20 max-w-7xl mx-auto px-6 min-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
              <div className="reveal-hidden aspect-[3/4] bg-white overflow-hidden shadow-sm">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="reveal-hidden stagger-2 flex flex-col justify-center space-y-10">
                <div className="space-y-4">
                  <p className="uppercase text-[10px] tracking-[0.3em] text-brand-gold font-bold">{selectedProduct.category}</p>
                  <h1 className="text-5xl md:text-6xl font-serif">{selectedProduct.name}</h1>
                  <p className="text-2xl font-serif italic text-brand-dark/80">R {selectedProduct.price.toLocaleString('en-ZA')}</p>
                </div>
                <p className="text-brand-muted leading-relaxed font-sans">{selectedProduct.description}</p>
                
                {selectedProduct.details && selectedProduct.details.length > 0 && (
                  <div className="space-y-3 py-8 border-t border-b border-brand-dark/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">Key Ingredients & Benefits</p>
                    <ul className="space-y-2">
                      {selectedProduct.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-brand-muted font-sans flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  onClick={() => handleAddToCart(null, selectedProduct)}
                  className="bg-brand-dark text-white py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 shadow-md"
                >
                  Add to Shopping Bag
                </button>
              </div>
            </div>

            {/* Related Products */}
            {storeService.getRelatedProducts(selectedProduct.id).length > 0 && (
              <div className="border-t border-brand-dark/10 pt-20">
                <div className="reveal-hidden mb-12">
                  <h3 className="text-3xl md:text-4xl font-serif mb-2">You Might Also Love</h3>
                  <p className="text-brand-muted text-sm">Complementary products from the same collection</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {storeService.getRelatedProducts(selectedProduct.id).map((product, idx) => (
                    <div key={product.id} className={`reveal-hidden stagger-${(idx % 3) + 1}`}>
                      <ProductCard 
                        product={product} 
                        onClick={navigateToProduct}
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {currentView === 'CART' && (
          <section className="py-20 max-w-4xl mx-auto px-6 min-h-[70vh]">
            <div className="reveal-hidden text-center mb-16">
              <h1 className="text-5xl font-serif uppercase tracking-widest">Shopping Bag</h1>
            </div>
            {cart.length === 0 ? (
              <div className="reveal-hidden text-center py-20">
                <p className="text-brand-muted italic mb-8">Your bag is empty.</p>
                <button onClick={() => setView('SHOP')} className="bg-brand-dark text-white px-10 py-4 text-xs uppercase tracking-widest">Shop Now</button>
              </div>
            ) : (
              <div className="space-y-12">
                {cart.map((item, idx) => (
                  <div key={item.id} className="reveal-hidden flex space-x-8 items-center border-b border-brand-dark/10 pb-8">
                    <img src={item.image} className="w-24 h-32 object-cover" alt={item.name} />
                    <div className="flex-grow">
                      <h3 className="font-serif text-xl">{item.name}</h3>
                      <div className="flex items-center space-x-4 pt-2">
                        <button onClick={() => handleUpdateQty(item.id, -1)} className="hover:text-brand-gold transition-colors px-2">-</button>
                        <span className="font-sans font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item.id, 1)} className="hover:text-brand-gold transition-colors px-2">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold">R {(item.price * item.quantity).toLocaleString('en-ZA')}</p>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="text-[10px] uppercase text-red-500 mt-2 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
                <div className="reveal-hidden flex flex-col items-end pt-10 space-y-4">
                  <div className="space-y-2 text-right">
                    <p className="text-sm text-brand-muted font-sans">Subtotal</p>
                    <p className="text-2xl font-serif mb-2">R {storeService.getCartTotal().toLocaleString('en-ZA')}</p>
                    <p className="text-xs text-brand-muted font-sans">Shipping & taxes calculated at checkout</p>
                  </div>
                  <button 
                    onClick={() => {
                        showToast('Order processed successfully. Thank you for shopping with Skinora!', 'success');
                        storeService.clearCart();
                        setCart([]);
                        setTimeout(() => setView('HOME'), 1500);
                    }} 
                    className="w-full bg-brand-dark text-white px-12 py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 shadow-xl"
                  >
                    Complete Checkout
                  </button>
                  <button
                    onClick={() => setView('SHOP')}
                    className="w-full border border-brand-dark text-brand-dark py-3 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark hover:text-white transition-all duration-500"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {currentView === 'ABOUT' && (
          <div className="min-h-screen">
            <section className="py-32 max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                <div className="reveal-hidden lg:col-span-7 space-y-12">
                  <div className="space-y-6">
                    <h4 className="uppercase text-brand-gold font-sans text-[10px] tracking-[0.4em] font-bold">The Heritage</h4>
                    <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-none">Purity in <br/><span className="italic">Every Drop</span></h1>
                  </div>
                  <p className="text-xl md:text-2xl text-brand-muted font-serif italic leading-relaxed max-w-xl">
                    Skinora was founded on the belief that skincare should be a ritual of restoration. Born from the rich botanical landscapes of South Africa.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-dark/70 font-sans text-sm leading-relaxed border-t border-brand-dark/5 pt-12">
                    <p>Our journey began in a small Cape Town studio with a mission: to return to ingredients that the skin truly recognizes.</p>
                    <p>Today, every Skinora formulation uses sustainably sourced local oils to deliver results that transcend the surface.</p>
                  </div>
                </div>
                
                <div className="reveal-hidden stagger-2 lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[400px] aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                      alt="Skinora Ritual"
                    />
                    <div className="absolute inset-0 bg-brand-gold/5 mix-blend-multiply"></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white py-32 px-6">
               <div className="max-w-4xl mx-auto text-center space-y-12">
                  <h2 className="reveal-hidden text-4xl md:text-5xl font-serif">Our Philosophy</h2>
                  <div className="reveal-hidden stagger-2 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-4">
                      <div className="text-brand-gold text-2xl font-serif">01.</div>
                      <h5 className="uppercase text-xs tracking-widest font-bold">Clinical Purity</h5>
                      <p className="text-xs text-brand-muted leading-relaxed">Formulated without parabens or synthetic fragrances.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-brand-gold text-2xl font-serif">02.</div>
                      <h5 className="uppercase text-xs tracking-widest font-bold">Local Sourcing</h5>
                      <p className="text-xs text-brand-muted leading-relaxed">Supporting South African farmers and eco-communities.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-brand-gold text-2xl font-serif">03.</div>
                      <h5 className="uppercase text-xs tracking-widest font-bold">Proven Results</h5>
                      <p className="text-xs text-brand-muted leading-relaxed">Dermatologically tested for all skin profiles.</p>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        )}

        {currentView === 'CONTACT' && (
          <div className="min-h-screen">
            <section className="py-24 max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div className="reveal-hidden space-y-16">
                  <div className="space-y-6">
                    <h4 className="uppercase text-brand-gold font-sans text-[10px] tracking-[0.4em] font-bold">Connect With Us</h4>
                    <h1 className="text-6xl md:text-7xl font-serif">Get in <span className="italic">Touch</span></h1>
                  </div>
                  
                  <div className="space-y-12">
                    <div className="flex space-x-8">
                      <div className="w-10 h-[1px] bg-brand-gold mt-3"></div>
                      <div className="space-y-4">
                        <h5 className="uppercase text-xs tracking-widest font-bold">The Studio</h5>
                        <p className="text-brand-muted text-sm leading-relaxed font-sans">
                          124 Bree Street, Heritage Square<br/>
                          JHB South, 2001<br/>
                          South Africa
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-8">
                      <div className="w-10 h-[1px] bg-brand-gold mt-3"></div>
                      <div className="space-y-4">
                        <h5 className="uppercase text-xs tracking-widest font-bold">Concierge</h5>
                        <p className="text-brand-muted text-sm font-sans">
                          concierge@skinora.co.za<br/>
                          +27 (0) 79 615 2160
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="reveal-hidden stagger-2 bg-white p-10 md:p-16 shadow-xl rounded-sm">
                  <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Message sent. Our concierge will contact you shortly.'); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 border-b border-brand-dark/10 pb-2">
                        <label className="uppercase text-[9px] tracking-[0.2em] font-bold text-brand-muted">Full Name</label>
                        <input required type="text" className="w-full bg-transparent outline-none font-sans text-sm py-1" placeholder="Jane Doe"/>
                      </div>
                      <div className="space-y-2 border-b border-brand-dark/10 pb-2">
                        <label className="uppercase text-[9px] tracking-[0.2em] font-bold text-brand-muted">Email Address</label>
                        <input required type="email" className="w-full bg-transparent outline-none font-sans text-sm py-1" placeholder="jane@example.com"/>
                      </div>
                    </div>
                    <div className="space-y-2 border-b border-brand-dark/10 pb-2">
                      <label className="uppercase text-[9px] tracking-[0.2em] font-bold text-brand-muted">Subject</label>
                      <select className="w-full bg-transparent outline-none font-sans text-sm py-1">
                        <option>Product Inquiry</option>
                        <option>Skin Consultation</option>
                        <option>Wholesale</option>
                        <option>Press</option>
                      </select>
                    </div>
                    <div className="space-y-2 border-b border-brand-dark/10 pb-2">
                      <label className="uppercase text-[9px] tracking-[0.2em] font-bold text-brand-muted">Your Message</label>
                      <textarea required rows={4} className="w-full bg-transparent outline-none font-sans text-sm py-1 resize-none" placeholder="How can we assist you?"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-brand-dark text-white py-5 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-brand-gold transition-all duration-500 shadow-lg">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer setView={setView} />
      <ScrollToTop />
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
