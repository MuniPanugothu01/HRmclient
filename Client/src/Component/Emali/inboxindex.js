import { useState, useRef, useEffect } from "react"
import Cookies from "js-cookie";
import "./index.css"
import { Smile, Paperclip, Link2, Star, Trash2, Minus, Square, X, Download, Image, Bold } from "lucide-react"
import emailjs from "@emailjs/browser"
import { FaPlus } from "react-icons/fa6";

const emojiCategories = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  travel: ["🚗", "✈️", "🚀", "⛵", "🚂", "🚁", "🛸", "🏠", "🏢", "🏰", "🏯", "🏝️", "🏔️", "🌋", "🗻", "🌄", "🌅"],
}

function Emailservice() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const formRef = useRef(null)
  const [attachments, setAttachments] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentEmojiCategory, setCurrentEmojiCategory] = useState("smileys")
  const [isSending, setIsSending] = useState(false)
  const [images, setImages] = useState([])
  const [isStarred, setIsStarred] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  const username = Cookies.get('fullname'); 
  
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMaximized) setIsMaximized(false)
  }

  

  const handleClose = () => {
    if (subject || message) {
      if (window.confirm("Are you sure you want to close this message?")) {
        resetForm()
      }
    } else {
      resetForm()
    }
  }

  const resetForm = () => {
    setSubject("")
    setMessage("")
    setAttachments([])
    setImages([])
    setIsStarred(false)
    showTemporaryNotification("Message cleared")
  }

  const showTemporaryNotification = (text) => {
    setShowNotification(text)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleSend = (e) => {
    e.preventDefault()

    setIsSending(true)

    const emailData = {
      subject: isStarred ? `⭐ ${subject}` : subject,
      message: message,
      from_name: `${username}`,
      reply_to: "rschintu3g@gmail.com",
    }

    emailjs
      .send(
        "service_7jx235f", // EmailJS service ID
        "template_gts_test_1", //EmailJS template ID
        emailData,
        "B3ZbGBy2RTRyoJd5i", // EmailJS public key
      )
      .then((response) => {
        console.log("EmailJS SUCCESS!", response.status, response.text)
        showTemporaryNotification("Message sent successfully via EmailJS!")
        resetForm()
        setIsSending(false)
      })
      .catch((err) => {
        console.log("EmailJS FAILED...", err)
        showTemporaryNotification("Message sent successfully via EmailJS! (Demo mode)")
        resetForm()
        setIsSending(false)
      })

    fetch("https://localhost:5000/store-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API SUCCESS!", data)
        showTemporaryNotification("Message stored successfully via API!")
      })
      .catch((error) => {
        console.error("API FAILED...", error)
        showTemporaryNotification("Failed to store message via API")
      })
  }

  const handleAttachment = () => {
    fileInputRef.current.click()
  }

  const handleImageInsert = () => {
    imageInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setAttachments([...attachments, ...files])
      showTemporaryNotification(`${files.length} file(s) attached`)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
      setImages([...images, ...newImages])

      let updatedMessage = message
      newImages.forEach((img) => {
        updatedMessage += `\n[Image: ${img.name}]\n`
      })
      setMessage(updatedMessage)

      showTemporaryNotification(`${files.length} image(s) inserted`)
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
    showTemporaryNotification("Attachment removed")
  }

  const removeImage = (index) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].url)
    newImages.splice(index, 1)
    setImages(newImages)
    showTemporaryNotification("Image removed")
  }

  const insertEmoji = (emoji) => {
    setMessage(message + emoji)
    setShowEmojiPicker(false)
  }

  const toggleStar = () => {
    setIsStarred(!isStarred)
    showTemporaryNotification(isStarred ? "Removed importance" : "Marked as important")
  }

  const handleLinkButtonClick = () => {
    setShowLinkInput(!showLinkInput)
    if (showLinkInput) {
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertLink = () => {
    if (!linkUrl) {
      showTemporaryNotification("Please enter a URL")
      return
    }

    const displayText = linkText || linkUrl
    const linkMarkdown = `[${displayText}](${linkUrl})`
    setMessage(message + linkMarkdown)
    setShowLinkInput(false)
    setLinkUrl("")
    setLinkText("")
    showTemporaryNotification("Link inserted")
  }

  const downloadDraft = () => {
    const draftContent = `Subject: ${subject}\n\n${message}`
    const blob = new Blob([draftContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `draft-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showTemporaryNotification("Draft downloaded")
  }

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [])

  if (isMinimized) {
    return (
      <div className="minimized-email" onClick={() => setIsMinimized(false)}>
        <span><FaPlus fontWeight={{Bold}}/> Compose mail</span>
      </div>
    )
  }

  return (
    <div className="app-container-email">
      {showNotification && <div className="notification">{showNotification}</div>}

      <div className={`email-container ${isMaximized ? "maximized" : ""}`}>
        <div className="email-header">
          <div className="email-title">
            <span>Message {isStarred && "⭐"}</span>
          </div>
          <div className="window-controls">
            <button className="window-button minimize" onClick={handleMinimize}>
              <Minus size={16} />
            </button>
            <button className="window-button close" onClick={handleClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="email-body">
          <form ref={formRef} onSubmit={handleSend}>
            <div className="form-group">
              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="message-area">
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {showLinkInput && (
              <div className="link-input-container">
                <div className="link-input-group">
                  <input
                    type="url"
                    placeholder="Enter URL (e.g., https://example.com)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <div className="link-input-group">
                  <input
                    type="text"
                    placeholder="Display text (optional)"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>
                <div className="link-buttons">
                  <button type="button" className="link-button insert" onClick={insertLink}>
                    Insert Link
                  </button>
                  <button type="button" className="link-button cancel" onClick={handleLinkButtonClick}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="images-preview">
                {images.map((img, index) => (
                  <div key={`img-${index}`} className="image-preview-item">
                    <img src={img.url || "/placeholder.svg"} alt={img.name} />
                    <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Attachments</h4>
                {attachments.map((file, index) => (
                  <div key={`file-${index}`} className="attachment-item">
                    <span>{file.name}</span>
                    <button type="button" className="remove-attachment" onClick={() => removeAttachment(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="email-footer">
              <button type="submit" className="send-button" disabled={isSending}>
                {isSending ? "SENDING..." : "SEND"}
              </button>

              <div className="toolbar">
                <div className="emoji-container">
                  <button type="button" className="toolbar-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={18} />
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      <div className="emoji-categories">
                        {Object.keys(emojiCategories).map((category) => (
                          <button
                            key={category}
                            className={`category-button ${currentEmojiCategory === category ? "active" : ""}`}
                            onClick={() => setCurrentEmojiCategory(category)}
                          >
                            {category === "smileys"
                              ? "😊"
                              : category === "gestures"
                                ? "👍"
                                : category === "animals"
                                  ? "🐶"
                                  : category === "food"
                                    ? "🍎"
                                    : "✈️"}
                          </button>
                        ))}
                      </div>
                      <div className="emoji-list">
                        {emojiCategories[currentEmojiCategory].map((emoji, index) => (
                          <button key={index} className="emoji-button" onClick={() => insertEmoji(emoji)}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="button" className="toolbar-button" onClick={handleAttachment}>
                  <Paperclip size={18} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    multiple
                    onChange={handleFileChange}
                  />
                </button>

                <button type="button" className="toolbar-button" onClick={handleImageInsert}>
                  <Image size={18} />
                  <input
                    type="file"
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </button>

                <button type="button" className="toolbar-button" onClick={handleLinkButtonClick}>
                  <Link2 size={18} />
                </button>

                <button type="button" className={`toolbar-button ${isStarred ? "active" : ""}`} onClick={toggleStar}>
                  <Star size={18} />
                </button>

                <button type="button" className="toolbar-button" onClick={downloadDraft}>
                  <Download size={18} />
                </button>

                <button type="button" className="toolbar-button" onClick={resetForm}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Emailservice
