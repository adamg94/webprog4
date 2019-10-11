#!/usr/bin/env python3
# coding: utf8


def main():
    source = open('data.txt', 'r', encoding='utf8')
    i = 0
    linecount = 0
    for line in source:
        f = open(f'data-splitted-{i}.txt','a+', encoding='utf-8')
        linecount +=1
        if linecount % 20 == 0:
            f.write(line.strip('\n'))
            i+=1
        else:
            f.write(line)
        f.close()
        print(f'processing line {linecount} and created files: {i+1}')
    source.close()

    
main()