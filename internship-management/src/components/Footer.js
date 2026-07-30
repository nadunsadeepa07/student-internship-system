function Footer() {
  return <footer className="footer">
        <div className="footer-grid">

          <div>
            <h3>InternHub</h3>
            <p>
              Advanced Internship Management Platform
              for students and companies.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/student-dashboard">Student</a>
            <a href="/company-dashboard">Company</a>
          </div>

          <div>
            <h4>Contact</h4>
            <p>support@internhub.com</p>
            <p>+94 77 123 4567</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Internship Management System.
          All Rights Reserved.
        </div>
      </footer>;
}

export default Footer;