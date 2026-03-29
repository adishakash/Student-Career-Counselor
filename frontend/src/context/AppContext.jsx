import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  student: null,         // { name, email, age, standard, phone }
  studentId: null,
  assessmentId: null,
  planType: null,        // 'free' | 'paid'
  currentStep: 'intake', // 'intake' | 'payment' | 'questionnaire' | 'done'
  upgradeToken: null,    // token for free→paid upgrade link
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_REGISTRATION':
      return {
        ...state,
        student: action.payload.student,
        studentId: action.payload.studentId,
        assessmentId: action.payload.assessmentId,
        planType: action.payload.planType,
        currentStep: action.payload.planType === 'paid' ? 'payment' : 'questionnaire',
      };
    case 'SET_PLAN_TYPE':
      return { ...state, planType: action.payload };
    case 'SET_UPGRADE_TOKEN':
      return { ...state, upgradeToken: action.payload };
    case 'PAYMENT_SUCCESS':
      return { ...state, currentStep: 'questionnaire' };
    case 'QUESTIONNAIRE_COMPLETE':
      return { ...state, currentStep: 'done' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
