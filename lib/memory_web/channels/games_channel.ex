defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
    # Get initial game on join
    game = Memory.GameBackup.load(name) || Game.new()

    # Save game after generating new state.
    Memory.GameBackup.save(socket.assigns[:name], game)
      socket = socket
		|> assign(:name, name)
		|> assign(:game, game)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("validate", %{ "idx" => ix}, socket) do
    game = Game.validate(socket.assigns[:game], ix)
    IO.puts "validation done"
    socket = assign(socket, :game, game)
    IO.puts "assign done"
    IO.inspect game
    Memory.GameBackup.save(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("checktile", payload, socket) do
    IO.puts "Calling check open tile"
    game = socket.assigns[:game]
    game = Game.check_open_tile(game, length(game.active_tile))
    socket = assign(socket, :game, game)
    IO.puts "check open tile done"
    IO.inspect game.clicks
    Memory.GameBackup.save(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => game, "matched" => game.matched}}, socket}
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    socket = assign(socket, :game, game)
    Memory.GameBackup.save(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
