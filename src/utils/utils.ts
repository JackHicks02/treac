//Anything which is a js secret object or prototype (ie arrays and functions) is pass by reference

import { useEffect, useMemo, useRef } from "react";
import { useRender } from "./useRender";
import { BitLine } from "../components/Squidward/Gates";
import { BitInOut } from "../types/types";

/**
 * Removes a specified element from an array.
 * @param array The array to remove the element from.
 * @param elementToRemove The element to be removed from the array.
 * @returns A new array with the element removed. (Remember array is pass by reference)
 * @template T The type of the elements in the array.
 */
export const removeElement = <T>(array: T[], elementToRemove: T): T[] => {
  return array.filter(element => element !== elementToRemove);
};

/**
 * Removes a specified element from multiple arrays.
 * @param arrays An array of arrays from which the element will be removed.
 * @param elementToRemove The element to be removed from each array.
 * @template T The type of the elements in the arrays.
 */
export const removeElementFromMany = <T>(arrays: T[][], elementToRemove: T) => {
  arrays.forEach((array)=> removeElement(array, elementToRemove))
}

export const useNLineMount = (nodes: BitInOut[], newValue: boolean[]) => {
  const render = useRender();
  const ins = useRef<BitLine[]>([])
  const outs = useRef<BitLine[]>([])

  useEffect(()=>{
    nodes.forEach((entry)=>{
      entry[0] === "in" ? ins.current.push(entry[1]): outs.current.push(entry[1])
    })

    ins.current.forEach(bitLine=> bitLine.pushSetter(render))

    return () => {
      ins.current.forEach(bitline => bitline.removeSetter(render))
    }
  }, [nodes])

  outs.current.forEach((bitLine, index)=>bitLine.setBit(newValue[index]))
}

export const useTwoLineMount = (ALine: BitLine, BLine: BitLine, CLine: BitLine, newValue: boolean) => {
  const render = useRender();

  useEffect(() => {
    ALine.pushSetter(render)
    BLine.pushSetter(render);
    //This is actually pretty stupid...
    //These gates don't need to render when their lines change
    //Later on they should have nodes that reflect change or this whole thing is stupid

    return () =>
        [ALine, BLine].forEach(bitLine => bitLine.removeSetter(render))
  }, []);

  CLine.setBit(newValue);
}

export const useUnaryMount = (ALine: BitLine, CLine: BitLine, newValue: boolean) => {
  const render = useRender()
  useEffect(()=> {
    ALine.pushSetter(render);
    return () => ALine.removeSetter(render)
  }, [])

  CLine.setBit(newValue)
}

export const useOneLineMount = (BitLine: BitLine) => {
  const render = useRender()
 useEffect(()=> {
  BitLine.pushSetter(render);

  return () => BitLine.removeSetter(render)
   }, [])

}