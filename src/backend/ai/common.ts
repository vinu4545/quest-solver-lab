// Min-heap priority queue for A*
export class MinHeap<T> {
  private data: { k: number; v: T }[] = [];
  size() { return this.data.length; }
  push(k: number, v: T) {
    this.data.push({ k, v });
    this.bubbleUp(this.data.length - 1);
  }
  pop(): T | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0].v;
    const end = this.data.pop()!;
    if (this.data.length) { this.data[0] = end; this.sinkDown(0); }
    return top;
  }
  private bubbleUp(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[i].k < this.data[p].k) { [this.data[i], this.data[p]] = [this.data[p], this.data[i]]; i = p; }
      else break;
    }
  }
  private sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2; let s = i;
      if (l < n && this.data[l].k < this.data[s].k) s = l;
      if (r < n && this.data[r].k < this.data[s].k) s = r;
      if (s !== i) { [this.data[s], this.data[i]] = [this.data[i], this.data[s]]; i = s; }
      else break;
    }
  }
}

export interface SolveStats {
  algorithm: string;
  steps: number;
  nodesExplored: number;
  timeMs: number;
  found: boolean;
}
