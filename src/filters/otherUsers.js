setInterval(() => {
    const userName = 'Eich';
    this.broadcastEvent(userName, GameEvent.End, { name: userName, presets: presets });
  });