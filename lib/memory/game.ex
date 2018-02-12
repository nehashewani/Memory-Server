defmodule Memory.Game do
  @moduledoc """
  Memory keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

	def new do
		%{
			char_array: shuffle_arr(),
			active_tile: [],
			clicks: 0,
			tiles: tiles_arr(),
			processing: false,
			score: 0,
      matched: false,
		}
	end
	def tiles_arr do
		for n <- 0..15, do: %{idx: n, text: "Try Me!", clicked: false, disabled: false, bgcolor: "btn btn-dark"}
	end



	def shuffle_arr do
		arr = ["A","A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"]
		arr = Enum.shuffle arr
	end
	def validate(game, idx) do
		letter = Enum.at(game.char_array, idx)
		tileState = Enum.at(game.tiles, idx)
    IO.puts letter
    IO.inspect(tileState)
		cond do
			length(game.active_tile) < 2 and !tileState.clicked and !tileState.disabled and !game.processing ->

			tileState = %{tileState | text: letter, clicked: true}
      clicks = game.clicks + 1
      tiles = game.tiles
      tiles = List.replace_at(tiles, idx, tileState)
      active_tile = game.active_tile
      active_tile= [idx | active_tile]
			#game = %{game | clicks: (game.clicks + 1), tiles: List.replace_at(game.tiles, idx, tileState), active_tile: [game.active_tile | idx]}
      game = Map.put(game, :clicks, clicks)
      IO.puts(game.clicks)
      game = Map.put(game, :tiles, tiles)
      IO.puts "updating game done"
      game = Map.put(game, :active_tile, active_tile)
      game = Map.put(game, :matched, false)
      #check_open_tile(game, length(game.active_tile))
      game.active_tile.length == 2 -> check_open_tile(game, length(game.active_length))
      true -> game
		end
	end

  def check_open_tile(game, len) when len == 2 do
    tile1 = Enum.at(game.tiles, Enum.at(game.active_tile,0))
    tile2 = Enum.at(game.tiles, Enum.at(game.active_tile,1))

    cond do
    tile1.text == tile2.text ->
      IO.puts "matched"
      tile1 = Map.put(tile1, :disabled, true)
      tile2 = Map.put(tile2, :disabled, true)
      tile1 = Map.put(tile1, :bgcolor, "btn btn-success")
      tile2 = Map.put(tile2, :bgcolor, "btn btn-success")
      tiles_arr = game.tiles
      tiles_arr = List.replace_at(tiles_arr, Enum.at(game.active_tile,0), tile1)
      tiles_arr = List.replace_at(tiles_arr, Enum.at(game.active_tile,1), tile2)
      game = %{game | score: game.score + 10, active_tile: [], tiles: tiles_arr, processing: false, matched: true}

    !game.processing ->
      game = Map.put(game,:processing, true)
      tile1 = Map.put(tile1, :clicked, false)
      tile2 = Map.put(tile2, :clicked, false)
      tile1 = Map.put(tile1, :text, "Try Me!")
      tile2 = Map.put(tile2, :text, "Try Me!")
      tiles_arr = game.tiles
      tiles_arr = List.replace_at(tiles_arr, Enum.at(game.active_tile,0), tile1)
      tiles_arr = List.replace_at(tiles_arr, Enum.at(game.active_tile,1), tile2)
      game = %{game | score: game.score - 2, active_tile: [], tiles: tiles_arr, processing: false, matched: false}
    end
  end
  def check_open_tile(game, len) do
  game
  end
end
