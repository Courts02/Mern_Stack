import React from 'react'
import './contact.css' 

export default function Contact() {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>We’d love to hear from you</p>
      <form>
        <div>
          <label>Name</label>
          <input type="text" placeholder="Your name" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Your email" />
        </div>
        <div>
          <label>Message</label>
          <textarea rows="4" placeholder="Your message"></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}
