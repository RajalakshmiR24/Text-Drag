import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
import './TextEditor.css';

const TextEditor = () => {
  const [text, setText] = useState("Celebrare");
  const [history, setHistory] = useState([{ value: "Celebrare", cursor: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editorPosition, setEditorPosition] = useState({ x: 100, y: 100 });
  
  const editorRef = useRef();

  // Handles text change and updates history for undo/redo functionality
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Update the history with the new text state
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, { value: newText, cursor: e.target.selectionStart }]);
    setHistoryIndex(newHistory.length);
  };

  // Handles undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex].value);
    }
  };

  // Handles redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex].value);
    }
  };

  // Handles bold formatting
  const toggleBold = () => {
    setIsBold(!isBold);
  };

  // Handles italic formatting
  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  // Handles underline formatting
  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
  };

  // Handles font size increase
  const increaseFontSize = () => {
    setFontSize(fontSize + 2);
  };

  // Handles font size decrease
  const decreaseFontSize = () => {
    if (fontSize > 8) {
      setFontSize(fontSize - 2);
    }
  };

  // Handles the start of text dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  // Handles the end of text dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handles text dragging while moving
  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - position.x;
      const deltaY = e.clientY - position.y;

      setEditorPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Handles double click to change the text
  const handleDoubleClick = () => {
    const newText = prompt("Enter new text:", text);
    if (newText !== null) {
      setText(newText);
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, { value: newText, cursor: 0 }]);
      setHistoryIndex(newHistory.length);
    }
  };

  return (
<div className="editor-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
  {/* Toolbar for Undo and Redo actions */}
  <div className="toolbar">
    <button onClick={handleUndo} className="toolbar-button">
      <FontAwesomeIcon icon={faUndo} /> Undo
    </button>
    <button onClick={handleRedo} className="toolbar-button">
      <FontAwesomeIcon icon={faRedo} /> Redo
    </button>
  </div>

  {/* Text Editor area */}
  <div
    className="editor"
    style={{
      fontSize: `${fontSize}px`,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      left: `${editorPosition.x}px`,
      top: `${editorPosition.y}px`,
      cursor: isDragging ? 'grabbing' : 'grab',
    }}
    ref={editorRef}
    onMouseDown={handleMouseDown}
    onDoubleClick={handleDoubleClick}
  >
    <textarea
      value={text}
      onChange={handleChange}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
      }}
    />
  </div>

  {/* Font Controls */}
  <div className="font-controls">
    <select>
      <option>Font</option>
    </select>
    <button onClick={decreaseFontSize}>-</button>
    <span>{fontSize}</span>
    <button onClick={increaseFontSize}>+</button>
    <button onClick={toggleBold}>
      <FontAwesomeIcon icon={faBold} />
    </button>
    <button onClick={toggleItalic}>
      <FontAwesomeIcon icon={faItalic} />
    </button>
    <button onClick={toggleUnderline}>
      <FontAwesomeIcon icon={faUnderline} />
    </button>
  </div>
</div>

  );
};

export default TextEditor;
