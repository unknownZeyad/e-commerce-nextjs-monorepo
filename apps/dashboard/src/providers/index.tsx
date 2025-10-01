import ReactQueryProvider from "./react-query-provider"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  )
}

export default Providers