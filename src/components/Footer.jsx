
import '../components_css/footer.css';


const Footer = ({version}) => {

    return (
        <div className='footer'>
            <p className='version'>
                v.{version}
            </p>
        </div>
    )
}

export default Footer;