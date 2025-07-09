import React, { useState } from 'react'
import api from '../../services/api'

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testApiConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      console.log('Тестирование подключения к API:', api.defaults.baseURL)
      
      // Тест здоровья сервера
      const healthResponse = await fetch(api.defaults.baseURL.replace('/api', '/health'))
      const healthData = await healthResponse.json()
      
      setTestResult({
        status: 'success',
        message: 'API работает корректно',
        details: {
          baseURL: api.defaults.baseURL,
          health: healthData,
          timestamp: new Date().toISOString()
        }
      })
      
    } catch (error) {
      console.error('Ошибка при тестировании API:', error)
      
      setTestResult({
        status: 'error',
        message: 'Не удалось подключиться к API',
        details: {
          baseURL: api.defaults.baseURL,
          error: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[rgba(255,255,255,0.6)] rounded-[19px] p-[13px] mb-[23px]">
      <h2 className="text-[20px] font-semibold mb-[16px]">Тест API подключения</h2>
      
      <div className="mb-[16px]">
        <p className="text-[14px] text-[#727272] mb-[8px]">
          Текущий API URL: {api.defaults.baseURL}
        </p>
        
        <button
          onClick={testApiConnection}
          disabled={isLoading}
          className="bg-blue-500 text-white px-[16px] py-[8px] rounded-[8px] text-[14px] disabled:opacity-50"
        >
          {isLoading ? 'Тестирование...' : 'Тестировать подключение'}
        </button>
      </div>

      {testResult && (
        <div className={`p-[16px] rounded-[12px] ${
          testResult.status === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`font-semibold mb-[8px] ${
            testResult.status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {testResult.message}
          </h3>
          
          <pre className="text-[12px] text-gray-600 overflow-auto">
            {JSON.stringify(testResult.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default ApiTest 