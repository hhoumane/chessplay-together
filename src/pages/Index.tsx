import ChessBoard from "@/components/ChessBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">Chess Game</h1>
        <ChessBoard />
      </div>
    </div>
  );
};

export default Index;