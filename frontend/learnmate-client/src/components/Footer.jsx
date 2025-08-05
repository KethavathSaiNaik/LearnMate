import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function ContactSection() {
  return (
    <div className="bg-dark text-light py-4" style={{ width: '100vw', height: '223px' }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
        {/* Left: Brand Info */}
        <div className="text-center text-md-start">
          <h4 className="fw-bold mb-2">LearnMate-AI</h4>
          <p className="text-secondary mb-2" style={{ maxWidth: '400px' }}>
            Empowering learners through intelligent document-based AI tools. Learn, summarize, quiz and chat — all in one place.
          </p>
          <small className="text-muted">
            © {new Date().getFullYear()} LearnMate. All rights reserved.
          </small>
        </div>

        {/* Right: Contact & Socials */}
        <div className="text-center text-md-end">
          <div className="mb-3">
            <a href="mailto:support@learnmate.ai" className="text-light text-decoration-none d-block">
              <strong>Email:</strong> support@learnmate.ai
            </a>
          </div>
          <div className="mb-3">
            <a href="tel:+919876543210" className="text-light text-decoration-none d-block">
              <strong>Phone:</strong> +91 98765 43210
            </a>
          </div>

          {/* Social Icons */}
          <div className="d-flex justify-content-center justify-content-md-end gap-3 pt-2">
            <a href="#" className="text-light fs-5 opacity-75 hover-opacity-100 transition-opacity">
              <FaTwitter />
            </a>
            <a href="#" className="text-light fs-5 opacity-75 hover-opacity-100 transition-opacity">
              <FaFacebookF />
            </a>
            <a href="#" className="text-light fs-5 opacity-75 hover-opacity-100 transition-opacity">
              <FaInstagram />
            </a>
            <a href="#" className="text-light fs-5 opacity-75 hover-opacity-100 transition-opacity">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;