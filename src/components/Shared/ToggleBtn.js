import React from 'react'

export default function ToggleBtn(props) {
  return (
    <button className="toggle-btn" onClick={() => props.setOpen(!props.open)} style={{top: props.open ? "12px" : "30px"}}>
      {
        props.open ?
          <img src="/assets/images/toggle-up.png" />
          : <img src="/assets/images/toggle-down.png" />
      }
    </button>
  )
}
