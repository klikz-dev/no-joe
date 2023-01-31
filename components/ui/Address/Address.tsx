import cn from 'classnames'
import s from './Address.module.css'
import React, { InputHTMLAttributes, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onChange?: (...args: any[]) => any
  onSelect?: (...args: any[]) => any
}

const Address: React.FC<Props> = (props) => {
  const { className, children, onChange, onSelect, ...rest } = props

  const rootClassName = cn(s.root, {}, className)

  const [address, setAddress] = useState('')

  const handleOnChange = (e: any) => {
    if (onChange) {
      setAddress(e)
      onChange(e)
    }
    return null
  }

  const handleOnSelect = (e: any) => {
    if (onSelect) {
      geocodeByAddress(e).then((results) => {
        setAddress(
          results[0].address_components[0].long_name +
            ' ' +
            results[0].address_components[1].short_name
        )
        onSelect(results)
      })
    }
    return null
  }

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleOnChange}
      onSelect={handleOnSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="relative">
          <input
            id="street1"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={address}
            {...getInputProps({
              placeholder: 'Street Adress...',
              className:
                'location-search-input bg-primary py-2 px-2 w-full appearance-none transition duration-150 ease-in-out pr-10 border text-gray-900 border-accents-6 focus:outline-none focus:shadow-outline-normal',
            })}
          />
          <div className="autocomplete-dropdown-container absolute shadow m-0 w-full">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, index) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item'
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' }
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  className="p-1"
                  key={index}
                >
                  <span>{suggestion.description}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  )
}

export default Address
