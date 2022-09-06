import React from 'react'
import AsyncSelect from 'react-select/async'
import {useHistory} from 'react-router-dom'


function SearchSelect({users}){

  const history = useHistory()
  const [searchInput, setSearchInput] = React.useState('')
  const [options, setOptions] = React.useState([]) 

  function handleChange(e){
    if(e?.value)
      history.push(`/profilo/${e.value}`)
  }

  React.useEffect(() => {
    if(users.length > 0)
    {
      let obj = []
      users.map((user) => obj.push({value: user.username, label: user.username}))

      setOptions(obj)
    }

  }, [users])

  const filterUsers = (input) => {
    return options.filter(user => 
      user.label.toLowerCase().includes(input.toLowerCase()))
  }

  const promiseOptions = (input => 
    new Promise(resolve => {
        resolve(filterUsers(input));
    }))

  const style = {
    control: (styles) => ({
      ...styles, backgroundColor:"#212529", borderColor: 'gray'
    }),
    input: (styles) => ({
      ...styles, color:'white'
    }),
    container: (styles) => ({
      ...styles, width:'250px'
    }),
    dropdownIndicator: (styles) => ({
      ...styles, display:'None'
    }),
    indicatorSeparator: (styles) => ({
      ...styles, display:'None'
    }),
    menu: (styles) => ({
      ...styles, backgroundColor:'#63695d'
    }),
    menuList: (styles) => ({
      ...styles, color:'white', overflowX:'hidden'
    }),
    singleValue: (styles) => ({
      ...styles, color:'white'
    }),
    option: (styles, state) => ({
      ...styles, backgroundColor: state.isFocused ?'#201522': state.isSelected ?'#201522' : '#63695d'
    }),
  }

  return (
    <>
      <AsyncSelect loadOptions={promiseOptions} styles={style} onChange={(e) => handleChange(e)}
        backspaceRemovesValue isClearable placeholder={'Cerca Utenti'}
        maxMenuHeight={200} defaultMenuIsOpen={false} cacheOptions/>
    </>

    )
}

export default SearchSelect