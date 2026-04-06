import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'

const AppContext = createContext(null)

const STORAGE_KEY = 'zorvyn_txs'

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
  } catch {
    return INITIAL_TRANSACTIONS
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }

    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions]
      return { ...state, transactions: updated, nextId: state.nextId + 1 }
    }

    case 'DELETE_TRANSACTION': {
      const updated = state.transactions.filter(t => t.id !== action.payload)
      return { ...state, transactions: updated }
    }

    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      )
      return { ...state, transactions: updated }
    }

    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } }

    case 'SET_TYPE_FILTER':
      return { ...state, filters: { ...state.filters, type: action.payload } }

    case 'SET_CAT_FILTER':
      return { ...state, filters: { ...state.filters, category: action.payload } }

    case 'SET_SORT':
      return {
        ...state,
        sort: {
          key: action.payload,
          dir: state.sort.key === action.payload ? state.sort.dir * -1 : -1,
        },
      }

    default:
      return state
  }
}

const initialState = {
  role: 'admin',
  activeTab: 'overview',
  transactions: loadTransactions(),
  nextId: 26,
  filters: { search: '', type: '', category: '' },
  sort: { key: 'date', dir: -1 },
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions))
    } catch {}
  }, [state.transactions])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
