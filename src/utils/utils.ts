//Anything which is a js secret object or prototype (ie arrays and functions) is pass by reference

import { useEffect } from "react";
import { render } from "react-dom";
import { useRender } from "./useRender";
import { LineWithListener } from "../components/Squidward/Squidward";

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

export const useTwoLineMount = (ALine: LineWithListener, BLine: LineWithListener, CLine?: LineWithListener) => {
  const render = useRender();

  useEffect(() => {
    ALine.bitLineListeners.push(render);
    BLine.bitLineListeners.push(render);
    //This is actually pretty stupid...
    //These gates don't need to render when their lines change
    //Later on they should have nodes that reflect change or this whole thing is stupid

    return () =>
      removeElementFromMany(
        [ALine.bitLineListeners, BLine.bitLineListeners],
        render
      );
  }, []);
  // if (bitLine.bit !== c) {
  //   bitLine.bit = c;
  //   bitLineListeners.forEach((listener) => listener());
  // }
}