class HomeController < ApplicationController
  def index
    Thread.current[:product_v8] ||= V8::Context.new.tap do |context|
      js = ""
      Dir["#{Rails.root}/../../js/*.js"].each do |file|
        if not file.include? "main.js"
          js += File.read(file)
        end 
      end
      context.eval(js)
    end

    @game  = Thread.current[:product_v8].eval("new CheckersGame")
    @board = Thread.current[:product_v8].eval("Board")
    
    @board = @board.new(nil, 8, 8, @game[:turn_values])
    @board.init()

    @piece = Thread.current[:product_v8].eval("new CheckersPiece('B')")
    @assoc = Thread.current[:product_v8].eval("PieceTileAssociation")
    @assoc = @assoc.new(@piece, @board[:arr][0][0])

    @assocs = [@assoc]
    @result = @game.can_move(@board, @assocs, 0, 0, 1, 1, "B")

  end
end
