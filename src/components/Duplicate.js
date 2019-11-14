import React from "react"

function Duplicate(props) {
    return (
        <div className="duplicate">
            <div className='dup'>{props.dup}</div>
            <hr></hr>
            <div className='count'>{props.count}</div>
        </div>
    )
}

export default Duplicate