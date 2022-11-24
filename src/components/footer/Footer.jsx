import './footer.scss';

const Footer = () => {
    return (
        <div className='footer'>
            <div className="brand-and-adress">
                <img src="/images/logo-teknoza.png" alt="Logo" height="50" className='logoImage' />
                <span>1717 Harrison St, San Fransisco,</span>
                <span>CA 94103, USA</span>


            </div>
            <div className='site-map'>
                <div className='site-map-list'>
                    <h5>MAIN MENU</h5>
                    <a href="/">Home</a>
                    <a href="/">Shop</a>
                    <a href="/">Products</a>
                    <a href="/">Kategories</a>
                </div>
                <div className='site-map-list'>
                    <h5>COMPANY</h5>
                    <a href="/">The Company</a>
                    <a href="/">Careers</a>
                    <a href="/">Press</a>
                </div><div className='site-map-list'>
                    <h5>DISCOVER</h5>
                    <a href="/">The Team</a>
                    <a href="/">Our History</a>
                    <a href="/">Brand Motto</a>
                </div><div className='site-map-list'>
                    <h5>FIND US ON</h5>
                    <a href="/">Facebook</a>
                    <a href="/">Twitter</a>
                    <a href="/">Instagram</a>

                </div>
            </div>        </div>
    )
}

export default Footer