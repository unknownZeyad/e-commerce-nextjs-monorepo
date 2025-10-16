export default function Login() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="p-5 rounded-xl border">
        <h1 className="text-3xl text-center font-bold">Login</h1>
        <form className="flex flex-col gap-3 mt-5">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}