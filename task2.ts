function getValidTrips(shipment: Shipment, trips: Trip[]): Trip[] {
    const validTrips: Trip[] = [];
    const nodes = new Set([...shipment.pickups, ...shipment.dropoffs]);
    const neighborMap = new Map<string, string[]>();
  
    trips.forEach(({ start, end }) => {
      neighborMap.set(start, (neighborMap.get(start) || []).concat(end));
      neighborMap.set(end, (neighborMap.get(end) || []).concat(start));
    });
  
    function isReachable(start: string, target: string, visited: Set<string>): boolean {
      if (start === target) return true;
      visited.add(start);
      return (neighborMap.get(start) || []).some(neighbor => !visited.has(neighbor) && isReachable(neighbor, target, visited));
    }
  
    for (const trip of trips) {
      const { start, end } = trip;
      if (nodes.has(start) && nodes.has(end) &&
          shipment.dropoffs.some(dropoff => isReachable(start, dropoff, new Set()))) {
        validTrips.push(trip);
      }
    }
  
    return validTrips;
  }